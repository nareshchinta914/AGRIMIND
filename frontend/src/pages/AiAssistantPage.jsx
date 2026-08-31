import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Camera,
  Upload,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Volume2,
  VolumeX,
  RotateCcw,
  Globe,
  Radio,
  Image as ImageIcon
} from 'lucide-react';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { aiService } from '../services/aiService';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from '../hooks/useToast';
import { useVoice } from '../hooks/useVoice';
import {
  createSpeechRecognizer,
  isSpeechRecognitionSupported,
  getFriendlySpeechError,
  VOICE_SUPPORTED_LANGUAGES,
  detectLanguageFromText
} from '../utils/speechUtils';

const getWelcomeMessage = (lang) => {
  const WELCOME_MAP = {
    ta: 'வணக்கம் விவசாயத் தோழரே! நான் உங்கள் "கிசான் AI தோழன்". பயிர் நோய்கள், உர பரிந்துரை, பாசன முறை அல்லது சந்தை விலைகள் பற்றி கேளுங்கள். மைக்ரோஃபோன் மூலம் பேசலாம் அல்லது டைப் செய்யலாம்!',
    te: 'నమస్కారం రైతు మిత్రమా! నేను మీ "కిసాన్ AI మిత్రుడిని". పంట తెగుళ్ళు, ఎరువులు, నీటిపారుదల లేదా మార్కెట్ ధరల గురించి నన్ను అడగండి. మీరు మైక్రోఫోన్ ద్వారా మాట్లాడవచ్చు లేదా టైప్ చేయవచ్చు!',
    hi: 'नमस्ते किसान भाई! मैं एग्रीमाइंड का "किसान साथी AI" हूँ। अपनी फसल में कोई बीमारी, खाद की मात्रा, या मंडी भाव के बारे में पूछें। माइक बटन दबाकर बोलें या टाइप करें!',
    kn: 'ನಮಸ್ಕಾರ ರೈತ ಮಿತ್ರರೇ! ನಾನು ನಿಮ್ಮ "ಕಿಸಾನ್ AI ಮಿತ್ರ". ಬೆಳೆ ರೋಗಗಳು, ರಸಗೊಬ್ಬರ ಪ್ರಮಾಣ, ನೀರಾವರಿ ಅಥವಾ ಮಾರುಕಟ್ಟೆ ದರಗಳ ಬಗ್ಗೆ ಕೇಳಿ.',
    ml: 'നമസ്കാരം കർഷക സുഹൃത്തേ! ഞാൻ നിങ്ങളുടെ "കിസാൻ AI സഹായി" ആണ്. വിള രോഗങ്ങൾ, വളം, നനയ്ക്കൽ അല്ലെങ്കിൽ വിപണി വിലകൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കാം.',
    mr: 'नमस्कार शेतकरी मित्रा! मी आपला "किसान AI सोबती" आहे. पीक रोग, खत नियोजन, पाणी व्यवस्थापन किंवा बाजारभावाबाबत विचारा.',
    bn: 'নমস্কার কৃষক বন্ধু! আমি আপনার "কিশান এআই সাথী"। ফসল রোগ, সার প্রয়োগ, সেচ বা বাজার দর সম্পর্কে জিজ্ঞাসা করুন।',
    gu: 'નમસ્તે ખેડૂત મિત્ર! હું તમારો "કિસાન AI મિત્ર" છું. પાકના રોગ, ખાતરની માત્રા, પિયત અથવા બજાર ભાવ વિશે પૂછો.',
    pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! ਮੈਂ ਤੁਹਾਡਾ "ਕਿਸਾਨ ਏਆਈ ਸਾਥੀ" ਹਾਂ। ਫ਼ਸਲਾਂ ਦੇ ਰੋਗ, ਖਾਦ, ਸਿੰਚਾਈ ਜਾਂ ਮੰਡੀ ਭਾਅ ਬਾਰੇ ਪੁੱਛੋ।',
    en: 'Namaste Farmer Friend! I am your Kisan AI Saathi. Ask me anything about crop diseases, fertilizer dosage, irrigation, or mandi rates. Speak into the microphone or type your question!'
  };
  return WELCOME_MAP[lang] || WELCOME_MAP.en;
};

const AiAssistantPage = () => {
  const { language: appLang, changeLanguage } = useLanguage();
  const { toast } = useToast();
  const { speak, stop, isSpeaking, setVoiceLanguage } = useVoice();

  // Language state for Voice Assistant
  const [selectedLang, setSelectedLang] = useState(appLang || 'en');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [voiceError, setVoiceError] = useState(null);

  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: getWelcomeMessage(appLang || 'en'),
      language: appLang || 'en',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [imageAnalysisModal, setImageAnalysisModal] = useState(null);
  const [imageAnalyzing, setImageAnalyzing] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognizerRef = useRef(null);

  // Synchronize when appLang changes
  useEffect(() => {
    if (appLang && appLang !== selectedLang) {
      setSelectedLang(appLang);
      setVoiceLanguage(appLang);
    }
  }, [appLang]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing, isListening]);

  // Clean up speech recognition on unmount
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

    // Add localized greeting notice in chat
    const greetingText = getWelcomeMessage(newLang);
    setMessages((prev) => [
      ...prev,
      {
        id: 'msg_lang_change_' + Date.now(),
        sender: 'ai',
        text: greetingText,
        language: newLang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const quickPromptsByLang = {
    en: [
      { label: '🌦️ Today\'s Live Weather', query: "What is today's weather and rain forecast?" },
      { label: '💰 Today\'s Tomato Price', query: "What is today's tomato market price?" },
      { label: '🌾 Yellow spots on leaves', query: 'Yellow spots on leaves, what is the remedy?' },
      { label: '🌱 Urea & DAP dosage', query: 'What is the optimal DAP and Urea dosage for paddy per acre?' },
      { label: '💧 Water schedule', query: 'What is the best irrigation schedule for this season?' }
    ],
    ta: [
      { label: '🌦️ இன்றைய வானிலை', query: 'இன்று வானிலை எப்படி இருக்கிறது? மழை வருமா?' },
      { label: '💰 இன்றைய தக்காளி விலை', query: 'இன்றைய தக்காளி விலை என்ன?' },
      { label: '🌾 இலை மஞ்சள் நோய்', query: 'என் நெற்பயிர் இலைகள் மஞ்சளாக மாறுகிறது, என்ன தீர்வு?' },
      { label: '🌱 ஏக்கருக்கு உர அளவு', query: 'ஒரு ஏக்கர் நெற்பயிருக்கு என்ன உரம் போட வேண்டும்?' },
      { label: '💧 பாசன நேரம்', query: 'பயிருக்கு எந்த நேரத்தில் தண்ணீர் பாய்ச்ச வேண்டும்?' }
    ],
    hi: [
      { label: '🌦️ आज का लाइव मौसम', query: 'आज का मौसम कैसा रहेगा? क्या बारिश होगी?' },
      { label: '💰 आज का टमाटर भाव', query: 'आज का टमाटर का मंडी भाव क्या है?' },
      { label: '🌾 पत्तियों का पीलापन', query: 'फसल की पत्तियों पर पीले धब्बे हैं, क्या उपचार करें?' },
      { label: '🌱 यूरिया व डीएपी मात्रा', query: 'प्रति एकड़ गेहूं में डीएपी और यूरिया की कितनी मात्रा दें?' },
      { label: '💧 सिंचाई का सही समय', query: 'फसल में सिंचाई का सबसे सही समय क्या है?' }
    ],
    te: [
      { label: '🌦️ నేటి ప్రత్యక్ష వాతావరణం', query: 'ఈ రోజు వాతావరణం ఎలా ఉంది? వర్షం పడుతుందా?' },
      { label: '💰 నేటి టమోటా ధర', query: 'ఈ రోజు టమోటా మార్కెట్ ధర ఎంత?' },
      { label: '🌾 ఆకుమచ్చ తెగులు', query: 'వరి ఆకులు పసుపు రంగులోకి మారుతున్నాయి, నివారణ ఏమిటి?' },
      { label: '🌱 ఎరువుల మోతాదు', query: 'ఎకరానికి ఎంత యూరియా మరియు డీఏపీ వేయాలి?' },
      { label: '💧 నీటిపారుదల సమయం', query: 'పంటకు నీరు ఎప్పుడు పెట్టాలి?' }
    ],
    ml: [
      { label: '🌦️ ഇന്നത്തെ കാലാവസ്ഥ', query: 'ഇന്നത്തെ കാലാവസ്ഥ എങ്ങനെയാണ്? മഴ സാധ്യതയുണ്ടോ?' },
      { label: '💰 ഇന്നത്തെ തക്കാളി വില', query: 'ഇന്നത്തെ തക്കാളി വിപണി വില എത്രയാണ്?' },
      { label: '🌾 ഇല മഞ്ഞളിപ്പ്', query: 'ഇലകളിൽ മഞ്ഞപ്പുള്ളികൾ വരുന്നു, എന്താണ് പരിഹാരം?' },
      { label: '🌱 വളപ്രയോഗം', query: 'ഏക്കറിന് എത്ര യൂറിയ നൽകണം?' },
      { label: '💧 നനയ്ക്കൽ സമയം', query: 'ഏത് സമയത്താണ് നനയ്ക്കേണ്ടത്?' }
    ],
    kn: [
      { label: '🌦️ ಇಂದಿನ ಹವಾಮಾನ', query: 'ಇಂದಿನ ಹವಾಮಾನ ಹೇಗಿದೆ? ಮಳೆ ಬರುತ್ತದೆಯೇ?' },
      { label: '💰 ಇಂದಿನ ಟೊಮೆಟೊ ದರ', query: 'ಇಂದಿನ ಟೊಮೆಟೊ ಬೆಲೆ ಎಷ್ಟು?' },
      { label: '🌾 ಎಲೆ ಹಳದಿ ರೋಗ', query: 'ಎಲೆಗಳು ಹಳದಿಯಾಗುತ್ತಿವೆ, ಪರಿಹಾರವೇನು?' },
      { label: '🌱 ರಸಗೊಬ್ಬರ ಪ್ರಮಾಣ', query: 'ಎಕರೆಗೆ ಎಷ್ಟು ಯೂರಿಯಾ ಹಾಕಬೇಕು?' },
      { label: '💧 ನೀರಾವರಿ ಸಮಯ', query: 'ಬೆಳೆಗೆ ನೀರು ಯಾವಾಗ ನೀಡಬೇಕು?' }
    ],
    mr: [
      { label: '🌦️ आजचे थेट हवामान', query: 'आजचे हवामान कसे आहे? पाऊस पडेल का?' },
      { label: '💰 आजचे टोमॅटो भाव', query: 'आजचे टोमॅटोचे बाजारभाव काय आहेत?' },
      { label: '🌾 पानांवरील डाग', query: 'पानांवर पिवळे डाग पडले आहेत, उपाय काय?' },
      { label: '🌱 खताचे प्रमाण', query: 'एकरी किती युरिया आणि डीएपी द्यावे?' },
      { label: '💧 पाणी देण्याची वेळ', query: 'पिकाला पाणी कधी द्यावे?' }
    ],
    bn: [
      { label: '🌦️ আজকের লাইভ আবহাওয়া', query: 'আজকের আবহাওয়া কেমন থাকবে? বৃষ্টি হবে কি?' },
      { label: '💰 আজকের টমেটোর দাম', query: 'আজকের টমেটোর বাজার দর কত?' },
      { label: '🌾 পাতার রোগ', query: 'পাতায় হলুদ দাগ দেখা যাচ্ছে, প্রতিকার কী?' },
      { label: '🌱 সারের মাত্রা', query: 'একর প্রতি কতটা ইউরিয়া ও ডিএপি দিতে হবে?' },
      { label: '💧 সেচ সময়সূচি', query: 'ফসলে সেচ কখন দিতে হবে?' }
    ],
    gu: [
      { label: '🌦️ આજનું લાઈવ હવામાન', query: 'આજનું હવામાન કેવું રહેશે? વરસાદ પડશે?' },
      { label: '💰 આજના ટામેટાના ભાવ', query: 'આજના ટામેટાના માર્કેટ યાર્ડ ભાવ શું છે?' },
      { label: '🌾 પાનમાં પીળાશ', query: 'પાન પીળા પડી રહ્યા છે, ઉપાય શું છે?' },
      { label: '🌱 ખાતરની માત્રા', query: 'એકરે કેટલું યુરિયા અને ડીએપી આપવું?' },
      { label: '💧 પિયત સમય', query: 'પાકને પિયત ક્યારે આપવું?' }
    ],
    pa: [
      { label: '🌦️ ਅੱਜ ਦਾ ਲਾਈਵ ਮੌਸਮ', query: 'ਅੱਜ ਦਾ ਮੌਸਮ ਕਿਹੋ ਜਿਹਾ ਰਹੇਗਾ? ਕੀ ਮੀਂਹ ਪਵੇਗਾ?' },
      { label: '💰 ਅੱਜ ਟਮਾਟਰ ਦਾ ਭਾਅ', query: 'ਅੱਜ ਟਮਾਟਰ ਦਾ ਮੰਡੀ ਭਾਅ ਕੀ ਹੈ?' },
      { label: '🌾 ਪੱਤਿਆਂ ਦਾ ਪੀਲਾਪਣ', query: 'ਪੱਤਿਆਂ ਤੇ ਪੀਲੇ ਧੱਬੇ ਹਨ, ਕੀ ਇਲਾਜ ਹੈ?' },
      { label: '🌱 ਖਾਦ ਦੀ ਮਾਤਰਾ', query: 'ਪ੍ਰਤੀ ਏਕੜ ਕਿੰਨਾ ਯੂਰੀਆ ਅਤੇ ਡੀਏਪੀ ਪਾਉਣਾ ਚਾਹੀਦਾ ਹੈ?' },
      { label: '💧 ਸਿੰਚਾਈ ਸਮਾਂ', query: 'ਫ਼ਸਲ ਨੂੰ ਪਾਣੀ ਕਦੋਂ ਲਾਉਣਾ ਚਾਹੀਦਾ ਹੈ?' }
    ]
  };

  const currentPrompts = quickPromptsByLang[selectedLang] || quickPromptsByLang.en;

  // Send message to AI assistant
  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text || !text.trim()) return;

    // Cancel current speech if talking
    stop();

    // Auto detect language from text if regional script is present
    const detected = detectLanguageFromText(text.trim());
    let langToUse = selectedLang;
    if (detected !== 'en') {
      langToUse = detected;
      if (detected !== selectedLang) {
        setSelectedLang(detected);
        setVoiceLanguage(detected);
      }
    }

    const userMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLiveTranscript('');
    setVoiceError(null);
    setIsProcessing(true);

    try {
      // Get browser GPS coordinates if permitted (3s timeout)
      const coords = await new Promise((resolve) => {
        if (!navigator.geolocation) return resolve(null);
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
          () => resolve(null),
          { timeout: 3000, maximumAge: 300000 }
        );
      });

      const response = await aiService.askKisanAI(text.trim(), langToUse, coords);
      const effectiveLang = response.language || langToUse;

      const aiReply = {
        id: 'msg_ai_' + Date.now(),
        sender: 'ai',
        text: response.reply,
        language: effectiveLang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: response.suggestedActions,
      };

      setMessages((prev) => [...prev, aiReply]);

      // Automatically speak the response aloud in the matching language
      speak(response.reply, effectiveLang);
    } catch (err) {
      toast.error('Failed to get AI response. Please check connection.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Start / Stop Microphone Speech Recognition
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
      toast.error('Speech Recognition is not supported by your browser. Please type your message.');
      return;
    }

    // Stop speaking if currently active
    stop();
    setVoiceError(null);
    setLiveTranscript('');

    const recognizer = createSpeechRecognizer({
      language: selectedLang,
      onStart: () => {
        setIsListening(true);
        setVoiceError(null);
      },
      onResult: ({ transcript, final, detectedLang }) => {
        setLiveTranscript(transcript);
        if (final && transcript.trim().length > 1) {
          setIsListening(false);
          handleSendMessage(transcript.trim());
        }
      },
      onError: (event) => {
        setIsListening(false);
        const friendlyMsg = getFriendlySpeechError(event, selectedLang);
        if (friendlyMsg) {
          setVoiceError(friendlyMsg);
          toast.warning(friendlyMsg);
        }
      },
      onEnd: () => {
        setIsListening(false);
      },
    });

    if (recognizer) {
      recognizerRef.current = recognizer;
      try {
        recognizer.start();
      } catch (err) {
        console.warn('Speech recognition start failed:', err);
        setIsListening(false);
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageAnalyzing(true);
    try {
      const result = await aiService.analyzeCropImage(file);
      setImageAnalysisModal(result);
      toast.success('Leaf disease scan completed!');
    } catch (err) {
      toast.error('Failed to analyze image');
    } finally {
      setImageAnalyzing(false);
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full min-h-[85vh] flex flex-col select-none">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-agri-950 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-2xl border border-agri-800/40 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-600 flex items-center justify-center text-slate-950 shadow-xl flex-shrink-0">
              <Bot className="w-8 h-8" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-slate-950 rounded-full animate-pulse"></span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-display text-white">Kisan AI Voice Assistant</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live Speech & Multilingual
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Speak or type in any Indian regional language for instant farming advisory.
            </p>
          </div>
        </div>

        {/* Right Header Controls: Language Selector + Scan Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Language Selector Dropdown */}
          <div className="relative flex items-center bg-slate-800/90 border border-slate-700 rounded-2xl px-3 py-1.5 shadow-inner">
            <Globe className="w-4 h-4 text-amber-400 mr-2" />
            <select
              value={selectedLang}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-1"
            >
              {VOICE_SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                  {l.flag} {l.nativeName} ({l.name})
                </option>
              ))}
            </select>
          </div>

          {/* Leaf Scan Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <Button
            variant="amber"
            size="sm"
            icon={Camera}
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-bold shadow-lg"
          >
            Scan Crop Leaf
          </Button>
        </div>
      </div>

      {/* Voice Assistant Live Status Bar */}
      <AnimatePresence>
        {(isListening || isProcessing || isSpeaking || voiceError) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4"
          >
            {isListening && (
              <div className="bg-gradient-to-r from-rose-950/90 via-amber-950/80 to-slate-900 border-2 border-rose-500/60 text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500"></span>
                  </span>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-rose-300 block">
                      🎙️ Listening in {VOICE_SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang)?.nativeName}...
                    </span>
                    <span className="text-xs text-slate-200 italic">
                      {liveTranscript ? `"${liveTranscript}"` : 'Speak your farming question now...'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleListening}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}

            {isProcessing && (
              <div className="bg-slate-900/90 border border-emerald-500/40 text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-300 block">
                      ⏳ Processing...
                    </span>
                    <span className="text-xs text-slate-300">
                      Analyzing agronomic data in {VOICE_SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang)?.name}...
                    </span>
                  </div>
                </div>
              </div>
            )}

            {isSpeaking && (
              <div className="bg-gradient-to-r from-emerald-950/90 via-teal-950/80 to-slate-900 border-2 border-emerald-400/60 text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Equalizer animated wave bars */}
                  <div className="flex items-end gap-1 h-5 pl-1 flex-shrink-0">
                    <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-2.5"></span>
                    <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-5 delay-75"></span>
                    <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-3.5 delay-150"></span>
                    <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-2 delay-100"></span>
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-300 block">
                      🔊 Speaking Response Aloud...
                    </span>
                    <span className="text-xs text-slate-200">
                      Audio playing in {VOICE_SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang)?.name}.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={stop}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg cursor-pointer transition-colors"
                >
                  <VolumeX className="w-4 h-4" /> Stop Speaking
                </button>
              </div>
            )}

            {voiceError && !isListening && (
              <div className="bg-amber-500/10 border border-amber-400/30 text-amber-200 p-3 rounded-2xl text-xs flex items-center justify-between gap-2">
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-3">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap pl-1">
          Suggested:
        </span>
        {currentPrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(p.query)}
            className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex-shrink-0 cursor-pointer shadow-sm active:scale-95"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main Chat Box Container */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col overflow-hidden">
        {/* Messages List */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[52vh]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {msg.sender === 'user' ? 'You' : <Bot className="w-5 h-5" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : 'bg-slate-50 border border-slate-200/90 text-slate-800 rounded-tl-none whitespace-pre-line'
                }`}
              >
                <div className="font-medium text-slate-800">
                  {msg.text}
                </div>

                <div className="flex items-center justify-between gap-3 mt-2.5 pt-2 border-t border-slate-200/60 text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>

                  {msg.sender === 'ai' && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => (isSpeaking ? stop() : speak(msg.text, msg.language || selectedLang))}
                        className="flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer"
                        title={isSpeaking ? 'Stop Audio' : 'Listen Aloud'}
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                            <span className="text-rose-600">Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Listen Aloud</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
                <span>Kisan AI is analyzing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50/90 flex items-center gap-2">
          {/* Real-time Voice Microphone Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3 sm:px-4 sm:py-3 rounded-2xl transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-md font-bold text-xs sm:text-sm ${
              isListening
                ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white animate-pulse ring-4 ring-rose-300/50'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95'
            }`}
            title="Click to Speak in selected language"
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5 animate-bounce" />
                <span className="hidden sm:inline">Listening...</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                <span className="hidden sm:inline">Speak</span>
              </>
            )}
          </button>

          {/* Stop Speaking button if audio playing */}
          {isSpeaking && (
            <button
              type="button"
              onClick={stop}
              className="p-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white shadow-md cursor-pointer transition-colors"
              title="Stop Speaking"
            >
              <VolumeX className="w-5 h-5" />
            </button>
          )}

          {/* Text Input Box (Alternative to voice) */}
          <input
            type="text"
            placeholder={
              isListening
                ? 'Listening to your voice... Speak now'
                : `Type or speak in ${VOICE_SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang)?.nativeName}...`
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 shadow-inner"
          />

          {/* Send button */}
          <Button
            variant="primary"
            size="md"
            icon={Send}
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="px-4 shadow-lg shadow-emerald-600/30"
          >
            <span className="hidden sm:inline">Send</span>
          </Button>
        </div>
      </div>

      {/* Disease Diagnosis Modal */}
      {imageAnalysisModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-5"
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                  Disease Detected
                </span>
                <h3 className="text-2xl font-black text-slate-900 font-display mt-2">
                  {imageAnalysisModal.diseaseDetected}
                </h3>
                <p className="text-xs font-semibold text-emerald-700">{imageAnalysisModal.hindiDisease}</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block font-semibold">AI Confidence</span>
                <span className="text-lg font-black text-emerald-600 font-display">
                  {imageAnalysisModal.confidence}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900 mb-1">Recommended Chemical Spray:</p>
                <ul className="list-disc list-inside space-y-1">
                  {imageAnalysisModal.recommendedCure?.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <p className="font-bold mb-1">Bio-Organic Alternative:</p>
                <p>{imageAnalysisModal.preventiveOrganicSolution}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="primary" onClick={() => setImageAnalysisModal(null)}>
                Got It, Thank You
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AiAssistantPage;
