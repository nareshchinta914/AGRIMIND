import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  X,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Camera,
  ArrowRight
} from 'lucide-react';
import { useVoice } from '../../hooks/useVoice';
import { useLanguage } from '../../hooks/useLanguage';
import {
  createSpeechRecognizer,
  speakText,
  stopSpeech,
  parseVoiceCommand,
} from '../../utils/speechUtils';
import { aiService } from '../../services/aiService';
import Button from '../common/Button';

const VoiceAssistantModal = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const { speak, stop, isSpeaking, openCamera } = useVoice();
  const navigate = useNavigate();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiReply, setAiReply] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const recognizerRef = useRef(null);

  // Initialize Speech Recognition & Greeting on Open
  useEffect(() => {
    if (!isOpen) {
      if (recognizerRef.current) {
        recognizerRef.current.abort();
      }
      setIsListening(false);
      stop();
      return;
    }

    setAiReply(null);
    setTranscript('');

    // Initial spoken greeting
    speak(t('howCanIHelp'));

    // Start Listening after greeting or on user tap
    const timer = setTimeout(() => {
      startListening();
    }, 1200);

    return () => {
      clearTimeout(timer);
      if (recognizerRef.current) {
        recognizerRef.current.abort();
      }
      stop();
    };
  }, [isOpen, language]);

  const startListening = () => {
    stop();
    setTranscript('');
    setAiReply(null);

    const recognizer = createSpeechRecognizer({
      language,
      onStart: () => setIsListening(true),
      onResult: ({ transcript: text, final }) => {
        setTranscript(text);
        if (final && text.trim().length > 2) {
          handleProcessVoiceInput(text.trim());
        }
      },
      onError: () => {
        setIsListening(false);
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
        console.warn('Speech recognition start error:', e);
      }
    }
  };

  const handleProcessVoiceInput = async (spokenText) => {
    setIsListening(false);
    setIsProcessing(true);

    const parsed = parseVoiceCommand(spokenText, language);

    // Check for direct voice navigation commands
    if (parsed?.type === 'navigate') {
      const toolName = t(parsed.translationKey || 'openTool');
      const confirmSpeech =
        language === 'ta'
          ? `${toolName} திறக்கப்படுகிறது...`
          : language === 'te'
          ? `${toolName} తెరవబడుతోంది...`
          : language === 'hi'
          ? `${toolName} खोला जा रहा है...`
          : `Opening ${toolName}...`;
      speak(confirmSpeech, language);
      setTimeout(() => {
        navigate(parsed.route);
        onClose();
      }, 1000);
      return;
    }

    if (parsed?.type === 'camera') {
      speak(t('cameraInstruction'), language);
      setTimeout(() => {
        onClose();
        openCamera();
      }, 800);
      return;
    }

    // Process natural AI question
    try {
      const response = await aiService.askKisanAI(spokenText, language);
      setAiReply(response.reply);
      setIsProcessing(false);

      // Speak response aloud to the farmer in their exact language
      speak(response.reply, response.language || language);
    } catch (err) {
      setIsProcessing(false);
      const fallback =
        language === 'ta'
          ? 'உங்கள் கேள்வி பதிவு செய்யப்பட்டது. பயிர் மற்றும் வானிலை தகவல்களை சரிபார்க்கவும்.'
          : language === 'te'
          ? 'మీ ప్రశ్న నమోదు చేయబడింది. దయచేసి పంట మరియు వాతావరణ సమాచారాన్ని చూడండి.'
          : language === 'hi'
          ? 'आपका प्रश्न प्राप्त हुआ। कृपया फसल एवं मौसम जानकारी देखें।'
          : 'I heard your question. Please check our crop and weather tools.';
      setAiReply(fallback);
      speak(fallback);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/30 text-center space-y-6 select-none"
        >
          {/* Header Close */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
                Ask AGRIMIND • Kisan Voice Assistant
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Center Giant Microphone */}
          <div className="py-4 flex flex-col items-center justify-center relative">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={startListening}
              className={`relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center text-white shadow-xl transition-all duration-300 cursor-pointer ${
                isListening
                  ? 'bg-gradient-to-tr from-rose-600 to-amber-500 shadow-rose-600/50 scale-105'
                  : 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-600/50 hover:scale-105'
              }`}
            >
              <Mic className={`w-10 h-10 ${isListening ? 'animate-bounce' : ''}`} />
              <span className="text-[10px] font-black uppercase tracking-wider mt-1">
                {isListening ? t('listening') : t('speakNow')}
              </span>
            </motion.button>

            <p className="text-xs text-slate-400 mt-3 font-medium">
              {isListening ? 'Listening to your voice... Speak naturally' : 'Tap microphone to speak again'}
            </p>
          </div>

          {/* Transcript / Spoken Question */}
          {transcript && (
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold italic text-center">
              "{transcript}"
            </div>
          )}

          {/* AI Response Card */}
          {isProcessing ? (
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 text-center space-y-2">
              <Sparkles className="w-6 h-6 text-amber-400 animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-300">Kisan AI is finding the best advice...</p>
            </div>
          ) : aiReply ? (
            <div className="bg-white text-slate-900 rounded-2xl p-5 shadow-xl text-left space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌾</span>
                  <h4 className="font-bold text-sm font-display text-slate-900">
                    Kisan AI Advice
                  </h4>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => (isSpeaking ? stop() : speak(aiReply))}
                    className="p-1.5 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors cursor-pointer"
                    title={isSpeaking ? 'Pause Audio' : 'Play Audio'}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => speak(aiReply)}
                    className="p-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                    title="Replay Audio"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                {aiReply}
              </div>

              <div className="pt-2 flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Audio playback enabled</span>
                <Button variant="outline" size="sm" onClick={() => startListening()} icon={Mic}>
                  Ask Another
                </Button>
              </div>
            </div>
          ) : null}

          {/* Quick Voice Prompt Suggestions */}
          <div className="pt-1 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Sample questions you can ask:
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {[
                'என் நெற்பயிருக்கு என்ன உரம் போட வேண்டும்?',
                'நாளைக்கு மழை வருமா?',
                'என் இலை ஏன் மஞ்சளாக இருக்கிறது?',
                'மண்டி தக்காளி விலை என்ன?'
              ].map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTranscript(sample);
                    handleProcessVoiceInput(sample);
                  }}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] text-slate-300 transition-colors cursor-pointer"
                >
                  "{sample}"
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
