import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  MicOff,
  X,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Camera,
  ArrowRight,
  Send,
  Globe,
  AlertCircle
} from 'lucide-react';
import { useVoice } from '../../hooks/useVoice';
import { useLanguage } from '../../hooks/useLanguage';
import {
  createSpeechRecognizer,
  isSpeechRecognitionSupported,
  getFriendlySpeechError,
  VOICE_SUPPORTED_LANGUAGES,
  detectLanguageFromText,
  parseVoiceCommand,
} from '../../utils/speechUtils';
import { aiService } from '../../services/aiService';
import Button from '../common/Button';

const getModalWelcome = (lang) => {
  const MAP = {
    ta: 'வணக்கம்! நான் உங்கள் கிசான் AI. உங்கள் கேள்வியைக் கேளுங்கள்.',
    te: 'నమస్కారం! నేను మీ కిసాన్ AI సహాయకుడిని. మీ ప్రశ్నను అడగండి.',
    hi: 'नमस्ते! मैं आपका किसान AI हूँ। कृपया अपनी फसल का सवाल पूछें।',
    kn: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕಿಸಾನ್ AI. ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಕೇಳಿ.',
    ml: 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ കിസാൻ AI സഹായിയാണ്. ചോദ്യം ചോദിക്കാം.',
    mr: 'नमस्कार! मी आपला किसान AI आहे. आपला प्रश्न विचारा.',
    bn: 'নমস্কার! আমি আপনার কিশান এআই। আপনার প্রশ্ন জিজ্ঞাসা করুন।',
    gu: 'નમસ્તે! હું તમારો કિસાન AI છું. તમારો પ્રશ્ન પૂછો.',
    pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਕਿਸਾਨ ਏਆਈ ਹਾਂ। ਆਪਣਾ ਸਵਾਲ ਪੁੱਛੋ।',
    en: 'Namaste! I am your Kisan AI. How can I help with your farming today?'
  };
  return MAP[lang] || MAP.en;
};

const VoiceAssistantModal = ({ isOpen, onClose }) => {
  const { language: appLang } = useLanguage();
  const { speak, stop, isSpeaking, openCamera, setVoiceLanguage } = useVoice();
  const navigate = useNavigate();

  const [selectedLang, setSelectedLang] = useState(appLang || 'en');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiReply, setAiReply] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [voiceError, setVoiceError] = useState(null);

  const recognizerRef = useRef(null);

  // Initialize Speech Recognition on Open
  useEffect(() => {
    if (!isOpen) {
      if (recognizerRef.current) {
        try {
          recognizerRef.current.abort();
        } catch (e) {}
      }
      setIsListening(false);
      setIsProcessing(false);
      stop();
      return;
    }

    setAiReply(null);
    setTranscript('');
    setVoiceError(null);
    const initialLang = appLang || 'en';
    setSelectedLang(initialLang);
    setVoiceLanguage(initialLang);

    // Welcome greeting
    const welcome = getModalWelcome(initialLang);
    speak(welcome, initialLang);

    // Auto-start listening after greeting
    const timer = setTimeout(() => {
      startListening();
    }, 1500);

    return () => {
      clearTimeout(timer);
      if (recognizerRef.current) {
        try {
          recognizerRef.current.abort();
        } catch (e) {}
      }
      stop();
    };
  }, [isOpen]);

  const handleLanguageChange = (newLang) => {
    setSelectedLang(newLang);
    setVoiceLanguage(newLang);
    stop();
    setVoiceError(null);
    const welcome = getModalWelcome(newLang);
    speak(welcome, newLang);
  };

  const startListening = () => {
    stop();
    setTranscript('');
    setAiReply(null);
    setVoiceError(null);

    if (!isSpeechRecognitionSupported()) {
      setVoiceError('Speech recognition is not supported in this browser. Please type your query below.');
      return;
    }

    const recognizer = createSpeechRecognizer({
      language: selectedLang,
      onStart: () => {
        setIsListening(true);
        setVoiceError(null);
      },
      onResult: ({ transcript: text, final }) => {
        setTranscript(text);
        if (final && text.trim().length > 1) {
          handleProcessVoiceInput(text.trim());
        }
      },
      onError: (event) => {
        setIsListening(false);
        const err = getFriendlySpeechError(event, selectedLang);
        if (err) setVoiceError(err);
      },
      onEnd: () => {
        setIsListening(false);
      },
    });

    if (recognizer) {
      recognizerRef.current = recognizer;
      try {
        recognizer.start();
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  const handleProcessVoiceInput = async (spokenText) => {
    if (recognizerRef.current) {
      try {
        recognizerRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
    setIsProcessing(true);
    setVoiceError(null);

    const detected = detectLanguageFromText(spokenText);
    let langToUse = selectedLang;
    if (detected !== 'en') {
      langToUse = detected;
      if (detected !== selectedLang) {
        setSelectedLang(detected);
        setVoiceLanguage(detected);
      }
    }

    const parsed = parseVoiceCommand(spokenText);

    // Check for direct voice navigation commands
    if (parsed?.type === 'navigate') {
      const confirmSpeech =
        langToUse === 'ta'
          ? `திறக்கப்படுகிறது...`
          : langToUse === 'te'
          ? `తెరవబడుతోంది...`
          : langToUse === 'hi'
          ? `खोला जा रहा है...`
          : `Opening ${parsed.label}...`;
      speak(confirmSpeech, langToUse);
      setTimeout(() => {
        navigate(parsed.route);
        onClose();
      }, 1000);
      return;
    }

    if (parsed?.type === 'camera') {
      speak(
        langToUse === 'ta'
          ? 'பயிர் இலையை கேமரா முன் காட்டவும்.'
          : langToUse === 'hi'
          ? 'कृपया पत्ती की तस्वीर लें।'
          : 'Please show your crop leaf to the camera.',
        langToUse
      );
      setTimeout(() => {
        onClose();
        openCamera();
      }, 800);
      return;
    }

    // Process natural AI question
    try {
      const response = await aiService.askKisanAI(spokenText, langToUse);
      const effectiveLang = response.language || langToUse;
      setAiReply(response.reply);
      setIsProcessing(false);

      // Speak response aloud in matching language
      speak(response.reply, effectiveLang);
    } catch (err) {
      setIsProcessing(false);
      const fallback =
        langToUse === 'ta'
          ? 'உங்கள் கேள்வி பதிவு செய்யப்பட்டது. பயிர் மற்றும் உர தகவல்களை சரிபார்க்கவும்.'
          : langToUse === 'te'
          ? 'మీ ప్రశ్న నమోదు చేయబడింది. దయచేసి పంట సమాచారాన్ని చూడండి.'
          : langToUse === 'hi'
          ? 'आपका प्रश्न प्राप्त हुआ। कृपया फसल जानकारी देखें।'
          : 'I received your query. Please review our crop advice tools.';
      setAiReply(fallback);
      speak(fallback, langToUse);
    }
  };

  const handleTextSubmit = (e) => {
    e?.preventDefault();
    if (!textInput.trim()) return;
    const query = textInput.trim();
    setTextInput('');
    setTranscript(query);
    handleProcessVoiceInput(query);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-emerald-500/30 text-center space-y-4 select-none"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                AGRIMIND Kisan Voice Assistant
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-2 py-1">
                <Globe className="w-3.5 h-3.5 text-amber-400 mr-1" />
                <select
                  value={selectedLang}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="bg-transparent text-[11px] font-bold text-white focus:outline-none cursor-pointer"
                >
                  {VOICE_SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                      {l.flag} {l.nativeName}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Giant Microphone / Action State Button */}
          <div className="py-2 flex flex-col items-center justify-center relative">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={isListening ? () => setIsListening(false) : startListening}
              className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-all duration-300 cursor-pointer ${
                isListening
                  ? 'bg-gradient-to-tr from-rose-600 to-amber-500 shadow-rose-600/50 scale-105 ring-4 ring-rose-400/40'
                  : 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-600/50 hover:scale-105'
              }`}
            >
              {isListening ? (
                <MicOff className="w-9 h-9 sm:w-10 sm:h-10 animate-bounce" />
              ) : (
                <Mic className="w-9 h-9 sm:w-10 sm:h-10" />
              )}
              <span className="text-[10px] font-black uppercase tracking-wider mt-1">
                {isListening ? 'Listening...' : 'Tap to Speak'}
              </span>
            </motion.button>

            {/* Dynamic Status Text */}
            <p className="text-xs text-slate-300 mt-2.5 font-medium">
              {isListening ? (
                <span className="text-rose-300 font-bold animate-pulse">
                  🎙️ Listening in {VOICE_SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang)?.nativeName}... Speak naturally
                </span>
              ) : isProcessing ? (
                <span className="text-amber-300 font-bold flex items-center gap-1.5 justify-center">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" /> Processing your farm query...
                </span>
              ) : isSpeaking ? (
                <span className="text-emerald-300 font-bold flex items-center gap-1.5 justify-center">
                  🔊 Speaking response in {VOICE_SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang)?.name}...
                </span>
              ) : (
                'Tap microphone to speak or type below'
              )}
            </p>
          </div>

          {/* Error Message */}
          {voiceError && !isListening && (
            <div className="bg-amber-500/10 border border-amber-400/30 text-amber-200 p-2.5 rounded-2xl text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{voiceError}</span>
              </div>
              <button
                type="button"
                onClick={() => setVoiceError(null)}
                className="text-[11px] font-bold text-amber-300 hover:underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Transcript Preview */}
          {transcript && (
            <div className="p-3 rounded-2xl bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold italic text-center">
              "{transcript}"
            </div>
          )}

          {/* AI Response Card */}
          {isProcessing ? (
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center space-y-2">
              <Sparkles className="w-6 h-6 text-amber-400 animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-300">Finding precise agronomy advice...</p>
            </div>
          ) : aiReply ? (
            <div className="bg-white text-slate-900 rounded-2xl p-4 shadow-xl text-left space-y-2.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">🌾</span>
                  <h4 className="font-bold text-xs sm:text-sm font-display text-slate-900">
                    Kisan AI Advice
                  </h4>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => (isSpeaking ? stop() : speak(aiReply, selectedLang))}
                    className="p-1.5 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors cursor-pointer"
                    title={isSpeaking ? 'Stop Audio' : 'Play Audio'}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => speak(aiReply, selectedLang)}
                    className="p-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                    title="Replay Audio"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-medium max-h-36 overflow-y-auto">
                {aiReply}
              </div>

              <div className="pt-1 flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Audio playback active</span>
                <Button variant="outline" size="sm" onClick={() => startListening()} icon={Mic} className="text-xs">
                  Ask Another
                </Button>
              </div>
            </div>
          ) : null}

          {/* Text Input Fallback */}
          <form onSubmit={handleTextSubmit} className="flex items-center gap-2 pt-1">
            <input
              type="text"
              placeholder={`Type query in ${VOICE_SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang)?.nativeName}...`}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-3.5 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!textInput.trim()}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-2xl cursor-pointer shadow-md transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Voice Prompt Suggestions */}
          <div className="pt-1 space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Sample questions:
            </p>
            <div className="flex flex-wrap gap-1 justify-center">
              {[
                { label: 'நெல் உரம்', query: 'என் நெற்பயிருக்கு என்ன உரம் போட வேண்டும்?' },
                { label: 'मंडी भाव', query: 'आज धान और टमाटर का मंडी भाव क्या है?' },
                { label: 'Water Advice', query: 'What is the optimal water irrigation schedule?' }
              ].map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTranscript(sample.query);
                    handleProcessVoiceInput(sample.query);
                  }}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-[10px] text-slate-300 transition-colors cursor-pointer"
                >
                  "{sample.label}"
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VoiceAssistantModal;
