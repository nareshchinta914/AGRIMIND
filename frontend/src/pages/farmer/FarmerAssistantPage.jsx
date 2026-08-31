import React, { useState, useRef, useEffect } from 'react';
import { Bot, Mic, MicOff, Send, Sparkles, Volume2, VolumeX, Globe, AlertCircle } from 'lucide-react';
import { useVoice } from '../../hooks/useVoice';
import { useLanguage } from '../../hooks/useLanguage';
import { aiService } from '../../services/aiService';
import Button from '../../components/common/Button';
import {
  createSpeechRecognizer,
  isSpeechRecognitionSupported,
  getFriendlySpeechError,
  VOICE_SUPPORTED_LANGUAGES,
  detectLanguageFromText
} from '../../utils/speechUtils';

const getFarmerWelcome = (lang) => {
  const MAP = {
    ta: 'வணக்கம்! நான் உங்கள் கிசான் AI உதவியாளர். உங்கள் பயிர், உரம், தண்ணீர் அல்லது சந்தை விலை குறித்து என்னிடம் பேசலாம் அல்லது டைப் செய்யலாம்.',
    te: 'నమస్కారం! నేను మీ కిసాన్ AI సహాయకుడిని. మీ పంట, ఎరువులు, నీరు లేదా మార్కెట్ ధరల గురించి నాతో మాట్లాడండి.',
    hi: 'नमस्ते! मैं आपका किसान AI सहायक हूँ। अपनी फसल, खाद, पानी या मंडी भाव के बारे में बोलकर या लिखकर पूछें।',
    kn: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕಿಸಾನ್ AI ಸಹಾಯಕ. ಬೆಳೆ, ರಸಗೊಬ್ಬರ, ನೀರು ಅಥವಾ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಯ ಬಗ್ಗೆ ಕೇಳಿ.',
    ml: 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ കിസാൻ AI സഹായിയാണ്. വിള, വളം, നനയ്ക്കൽ അല്ലെങ്കിൽ വിപണി വിലകൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കാം.',
    mr: 'नमस्कार! मी आपला किसान AI सहाय्यक आहे. पीक, खत, पाणी किंवा बाजारभावाबद्दल बोला किंवा लिहा.',
    bn: 'নমস্কার! আমি আপনার কিশান এআই সহকারী। ফসল, সার, জল বা বাজার দর সম্পর্কে বলুন বা লিখুন।',
    gu: 'નમસ્તે! હું તમારો કિસાન AI સહાયક છું. પાક, ખાતર, પાણી કે બજાર ભાવ વિશે પૂછો.',
    pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਕਿਸਾਨ ਏਆਈ ਸਹਾਇਕ ਹਾਂ। ਫ਼ਸਲ, ਖਾਦ, ਪਾਣੀ ਜਾਂ ਮੰਡੀ ਭਾਅ ਬਾਰੇ ਪੁੱਛੋ।',
    en: 'Namaste! I am your Kisan AI Assistant. Ask me about your crops, fertilizer, irrigation, or mandi prices by speaking or typing.'
  };
  return MAP[lang] || MAP.en;
};

const FarmerAssistantPage = () => {
  const { language: appLang } = useLanguage();
  const { openAssistant, speak, stop, isSpeaking, setVoiceLanguage } = useVoice();

  const [selectedLang, setSelectedLang] = useState(appLang || 'ta');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [voiceError, setVoiceError] = useState(null);

  const [messages, setMessages] = useState([
    {
      id: 'init_1',
      sender: 'ai',
      text: getFarmerWelcome(appLang || 'ta'),
      time: 'Just now',
      language: appLang || 'ta'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const recognizerRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isListening]);

  useEffect(() => {
    return () => {
      if (recognizerRef.current) {
        try {
          recognizerRef.current.abort();
        } catch (e) {}
      }
      stop();
    };
  }, []);

  const handleLanguageChange = (newLang) => {
    setSelectedLang(newLang);
    setVoiceLanguage(newLang);
    stop();
    setVoiceError(null);
    const greeting = getFarmerWelcome(newLang);
    setMessages((prev) => [
      ...prev,
      {
        id: 'msg_f_lang_' + Date.now(),
        sender: 'ai',
        text: greeting,
        language: newLang,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text || !text.trim()) return;

    stop();
    const detected = detectLanguageFromText(text.trim());
    let langToUse = selectedLang;
    if (detected !== 'en') {
      langToUse = detected;
      if (detected !== selectedLang) {
        setSelectedLang(detected);
        setVoiceLanguage(detected);
      }
    }

    const userMsg = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLiveTranscript('');
    setVoiceError(null);
    setIsTyping(true);

    try {
      const coords = await new Promise((resolve) => {
        if (!navigator.geolocation) return resolve(null);
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
          () => resolve(null),
          { timeout: 3000, maximumAge: 300000 }
        );
      });

      const response = await aiService.askKisanAI(userMsg.text, langToUse, coords);
      const effectiveLang = response.language || langToUse;

      const aiReply = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: response.reply,
        language: effectiveLang,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiReply]);
      speak(response.reply, effectiveLang);
    } catch (err) {
      toast.error('Unable to reach Kisan AI. Please check connection.');
    } finally {
      setIsTyping(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognizerRef.current) {
        try {
          recognizerRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      setVoiceError('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    stop();
    setVoiceError(null);
    setLiveTranscript('');

    const recognizer = createSpeechRecognizer({
      language: selectedLang,
      onStart: () => {
        setIsListening(true);
        setVoiceError(null);
      },
      onResult: ({ transcript, final }) => {
        setLiveTranscript(transcript);
        if (final && transcript.trim().length > 1) {
          setIsListening(false);
          handleSend(transcript.trim());
        }
      },
      onError: (event) => {
        setIsListening(false);
        const err = getFriendlySpeechError(event, selectedLang);
        if (err) setVoiceError(err);
      },
      onEnd: () => {
        setIsListening(false);
      }
    });

    if (recognizer) {
      recognizerRef.current = recognizer;
      try {
        recognizer.start();
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  return (
    <div className="space-y-4 select-none max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-yellow-400 text-slate-950 px-2.5 py-0.5 rounded-full">
            🎙️ Kisan AI Voice & Chat Saathi
          </span>
          <h2 className="text-xl sm:text-2xl font-black font-display mt-1">
            Farmer AI Voice Assistant
          </h2>
          <p className="text-xs text-slate-300">
            Ask farm disease queries, fertilizer recipes, or weather guidance by voice or text.
          </p>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-2xl px-3 py-1.5 shadow-inner">
            <Globe className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
            <select
              value={selectedLang}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              {VOICE_SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                  {l.flag} {l.nativeName}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="amber"
            size="sm"
            icon={Mic}
            onClick={openAssistant}
            className="shadow-lg shadow-yellow-500/30 text-xs font-bold"
          >
            Voice Modal
          </Button>
        </div>
      </div>

      {/* Voice Status Banners */}
      {isListening && (
        <div className="bg-gradient-to-r from-rose-950/90 to-amber-950/80 border-2 border-rose-500/60 text-white p-3 rounded-2xl flex items-center justify-between gap-2 shadow-lg">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
            </span>
            <div>
              <span className="text-xs font-black text-rose-300 block">
                🎙️ Listening in {VOICE_SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang)?.nativeName}...
              </span>
              <span className="text-xs text-slate-200 italic">
                {liveTranscript ? `"${liveTranscript}"` : 'Speak now...'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleListening}
            className="px-2.5 py-1 rounded-xl bg-rose-600 text-white text-xs font-bold cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {isSpeaking && (
        <div className="bg-emerald-950/90 border-2 border-emerald-400/60 text-white p-3 rounded-2xl flex items-center justify-between gap-2 shadow-lg">
          <div className="flex items-center gap-2.5">
            <div className="flex items-end gap-0.5 h-4">
              <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-2"></span>
              <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-4 delay-75"></span>
              <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-3 delay-150"></span>
            </div>
            <span className="text-xs font-bold text-emerald-200">
              🔊 Speaking in {VOICE_SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang)?.name}...
            </span>
          </div>
          <button
            type="button"
            onClick={stop}
            className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <VolumeX className="w-3.5 h-3.5" /> Stop
          </button>
        </div>
      )}

      {voiceError && !isListening && (
        <div className="bg-amber-500/10 border border-amber-400/30 text-amber-200 p-2.5 rounded-2xl text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{voiceError}</span>
          </div>
          <button
            type="button"
            onClick={() => setVoiceError(null)}
            className="font-bold text-amber-300 hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Interactive Chat Box */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-slate-50 text-slate-900 rounded-bl-none border border-slate-200'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                <div className="flex items-center justify-between gap-2 mt-2 pt-1.5 border-t border-black/10 text-[10px] opacity-75">
                  <span>{m.time}</span>
                  {m.sender === 'ai' && (
                    <button
                      type="button"
                      onClick={() => (isSpeaking ? stop() : speak(m.text, m.language || selectedLang))}
                      className="hover:underline flex items-center gap-1 font-bold cursor-pointer text-emerald-800"
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-3 h-3 text-rose-600" />
                          <span className="text-rose-600">Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3" />
                          <span>Listen Aloud</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-100 p-3 rounded-2xl text-xs text-slate-500 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                <span>🌱 Kisan AI is analyzing agricultural records...</span>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2"
        >
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3 rounded-2xl transition-all duration-200 cursor-pointer ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse shadow-lg'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
            }`}
            title="Click to Speak"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {isSpeaking && (
            <button
              type="button"
              onClick={stop}
              className="p-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white cursor-pointer transition-colors shadow-sm"
              title="Stop Speaking"
            >
              <VolumeX className="w-5 h-5" />
            </button>
          )}

          <input
            type="text"
            placeholder={
              isListening
                ? 'Listening... Speak your farm question'
                : `Type or speak in ${VOICE_SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang)?.nativeName}...`
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 py-2.5 px-4 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white cursor-pointer transition-colors shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default FarmerAssistantPage;
