// Web Speech API wrapper for Speech-to-Text (STT) and Text-to-Speech (TTS)
import { LANGUAGES } from './constants';

// BCP-47 speech codes mapping
export const LANG_SPEECH_CODES = {
  en: 'en-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  hi: 'hi-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  pa: 'pa-IN',
  or: 'or-IN'
};

// Supported Voice Languages configuration for AGRIMIND (All configured languages)
export const VOICE_SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', speechCode: 'en-IN', flag: '🌐' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', speechCode: 'ta-IN', flag: '🌾' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', speechCode: 'te-IN', flag: '🌽' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', speechCode: 'hi-IN', flag: '🚜' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', speechCode: 'kn-IN', flag: '🌿' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', speechCode: 'ml-IN', flag: '🌴' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', speechCode: 'mr-IN', flag: '🌾' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', speechCode: 'bn-IN', flag: '🌾' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', speechCode: 'gu-IN', flag: '🌾' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', speechCode: 'pa-IN', flag: '🌾' }
];

/**
 * Automatically detect Indian regional language from text script with dominant character frequency counting
 */
export const detectLanguageFromText = (text, userSelectedLang = 'en') => {
  if (!text || typeof text !== 'string') return userSelectedLang || 'en';
  
  let taCount = 0;
  let teCount = 0;
  let mlCount = 0;
  let knCount = 0;
  let hiCount = 0;
  let guCount = 0;
  let paCount = 0;
  let bnCount = 0;
  let latinCount = 0;

  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code >= 0x0B80 && code <= 0x0BFF) taCount++;
    else if (code >= 0x0C00 && code <= 0x0C7F) teCount++;
    else if (code >= 0x0D00 && code <= 0x0D7F) mlCount++;
    else if (code >= 0x0C80 && code <= 0x0CFF) knCount++;
    else if (code >= 0x0900 && code <= 0x097F) hiCount++;
    else if (code >= 0x0A80 && code <= 0x0AFF) guCount++;
    else if (code >= 0x0A00 && code <= 0x0A7F) paCount++;
    else if (code >= 0x0980 && code <= 0x09FF) bnCount++;
    else if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) latinCount++;
  }

  const scriptCounts = [
    { lang: 'ta', count: taCount },
    { lang: 'te', count: teCount },
    { lang: 'ml', count: mlCount },
    { lang: 'kn', count: knCount },
    { lang: 'hi', count: hiCount },
    { lang: 'gu', count: guCount },
    { lang: 'pa', count: paCount },
    { lang: 'bn', count: bnCount }
  ];

  scriptCounts.sort((a, b) => b.count - a.count);

  // If Indian script is present, return dominant script
  if (scriptCounts[0].count > 0) {
    return scriptCounts[0].lang;
  }

  // If text is purely ASCII / English characters:
  // If user has explicitly selected a regional language from selector (e.g. Tamil or Telugu or Hindi) and types transliteration, prioritize selected
  if (userSelectedLang && userSelectedLang !== 'en') {
    return userSelectedLang;
  }

  return 'en';
};

/**
 * Translate speech recognition errors into user-friendly guidance
 */
export const getFriendlySpeechError = (error, language = 'en') => {
  const errType = typeof error === 'string' ? error : error?.error || '';
  
  const isTa = language === 'ta';
  const isTe = language === 'te';
  const isHi = language === 'hi';
  const isMl = language === 'ml';
  const isKn = language === 'kn';

  if (errType === 'not-allowed' || errType === 'service-not-allowed') {
    if (isTa) return 'மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது. பிரவுசர் அமைப்புகளில் மைக்கை அனுமதிக்கவும்.';
    if (isTe) return 'మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. దయచేసి బ్రౌజర్ సెట్టింగ్స్‌లో మైక్‌ను అనుమతించండి.';
    if (isHi) return 'माइक्रोफ़ोन की अनुमति अस्वीकृत है। कृपया ब्राउज़र सेटिंग्स में माइक की अनुमति दें।';
    if (isMl) return 'മൈക്രോഫോൺ അനുമതി നിഷേധിച്ചു. ദയവായി ബ്രൗസർ ക്രമീകരണങ്ങളിൽ മൈക്ക് അനുവദിക്കുക.';
    if (isKn) return 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿಯನ್ನು ನಿರಾಕರಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ ಮೈಕ್ ಅನ್ನು ಅನುಮತಿಸಿ.';
    return 'Microphone permission denied. Please allow microphone access in your browser settings to speak.';
  }

  if (errType === 'no-speech') {
    if (isTa) return 'குரல் கேட்கவில்லை. மைக் அருகே தெளிவாக பேசவும்.';
    if (isTe) return 'ఎలాంటి మాటలు వినిపించలేదు. దయచేసి మైక్ దగ్గర స్పష్టంగా మాట్లాడండి.';
    if (isHi) return 'कोई आवाज़ सुनाई नहीं दी। कृपया माइक के पास साफ़ बोलें।';
    if (isMl) return 'ശബ്ദം കേൾക്കാൻ കഴിഞ്ഞില്ല. ദയവായി മൈക്കിന് അരികിൽ വ്യക്തമായി സംസാരിക്കുക.';
    if (isKn) return 'ಯಾವುದೇ ಧ್ವನಿ ಕೇಳಿಸಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮೈಕ್ ಬಳಿ ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ.';
    return 'No speech detected. Please speak closer to your microphone and try again.';
  }

  if (errType === 'network') {
    if (isTa) return 'இணைய இணைப்பு குறைபாடு. நீங்கள் டைப் செய்தும் கேள்வி கேட்கலாம்.';
    if (isTe) return 'నెట్‌వర్క్ సమస్య ఉంది. మీరు టైప్ చేసి కూడా అడగవచ్చు.';
    if (isHi) return 'नेटवर्क समस्या है। आप टाइप करके भी पूछ सकते हैं।';
    if (isMl) return 'നെറ്റ്‌വർക്ക് പ്രശ്നം. നിങ്ങൾക്ക് ടൈപ്പ് ചെയ്തും ചോദിക്കാം.';
    if (isKn) return 'ನೆಟ್‌ವರ್ಕ್ ಸಮಸ್ಯೆ ಇದೆ. ನೀವು ಟೈಪ್ ಮಾಡುವ ಮೂಲಕವೂ ಕೇಳಬಹುದು.';
    return 'Network connection issue for speech service. You can also type your question.';
  }

  if (errType === 'audio-capture') {
    if (isTa) return 'மைக்ரோஃபோன் கிடைக்கவில்லை. மைக் இணைக்கப்பட்டுள்ளதா என சரிபார்க்கவும்.';
    if (isTe) return 'మైక్రోఫోన్ కనెక్ట్ కాలేదు. దయచేసి మైక్ చెక్ చేయండి.';
    if (isHi) return 'माइक्रोफ़ोन नहीं मिला। कृपया माइक कनेक्शन जांचें।';
    return 'No microphone found. Please ensure a working microphone is connected.';
  }

  if (errType === 'aborted') {
    return null; // Silent abort on user stop
  }

  return 'Voice recognition issue. Please tap the mic again or type your question.';
};

// Friendly audio chime on listening start
export const playChime = (frequency = 587.33, type = 'sine', duration = 0.15) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Non-critical audio chime error
  }
};

/**
 * Check if Web Speech Recognition is supported
 */
export const isSpeechRecognitionSupported = () => {
  return typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
};

/**
 * Check if Web Speech Synthesis (TTS) is supported
 */
export const isSpeechSynthesisSupported = () => {
  return typeof window !== 'undefined' && Boolean(window.speechSynthesis);
};

/**
 * Initialize Web Speech Recognition with full event handling
 */
export const createSpeechRecognizer = ({
  language = 'en',
  onResult,
  onError,
  onStart,
  onEnd,
}) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn('Web Speech Recognition is not supported in this browser.');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  const langKey = (language || 'en').toLowerCase().slice(0, 2);
  recognition.lang = LANG_SPEECH_CODES[langKey] || 'en-IN';

  recognition.onstart = () => {
    playChime(659.25, 'sine', 0.12);
    if (onStart) onStart();
  };

  recognition.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    const currentText = finalTranscript || interimTranscript;
    const detectedLang = detectLanguageFromText(currentText, language);

    if (onResult) {
      onResult({
        final: finalTranscript,
        interim: interimTranscript,
        transcript: currentText,
        detectedLang: detectedLang || language,
      });
    }
  };

  recognition.onerror = (event) => {
    console.warn('Speech Recognition Error:', event.error);
    if (onError) onError(event);
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  return recognition;
};

/**
 * Text-to-Speech (TTS) Voice Synthesis
 */
let currentUtterance = null;

export const speakText = (text, language = 'en', callbacks = {}) => {
  if (!('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis is not supported in this browser.');
    return;
  }

  // Cancel ongoing speech
  window.speechSynthesis.cancel();

  if (!text) return;

  // Clean markdown / symbols for natural spoken speech
  const cleanText = text
    .replace(/[*#_`~>]/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .trim();

  if (!cleanText) return;

  // Detect script from text so voice engine uses the true language of the text
  const scriptLang = detectLanguageFromText(cleanText, language);
  const langCode = (scriptLang || language || 'en').toLowerCase().slice(0, 2);
  const speechLang = LANG_SPEECH_CODES[langCode] || 'en-IN';

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = speechLang;
  utterance.rate = 0.95; // Clear natural pacing for farmers
  utterance.pitch = 1.0;

  // Select matching voice
  const updateVoiceAndSpeak = () => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      // 1. Exact BCP-47 match (e.g. ta-IN, te-IN, hi-IN, ml-IN, kn-IN)
      const exactMatch = voices.find(
        (v) => v.lang.toLowerCase().replace('_', '-') === speechLang.toLowerCase()
      );
      // 2. Language prefix match (e.g. ta, te, hi, ml, kn)
      const prefixMatch = voices.find(
        (v) => v.lang.toLowerCase().startsWith(langCode)
      );
      // 3. Name match containing language name
      const nameMatch = voices.find((v) =>
        v.name.toLowerCase().includes(
          langCode === 'ta' ? 'tamil' :
          langCode === 'te' ? 'telugu' :
          langCode === 'hi' ? 'hindi' :
          langCode === 'kn' ? 'kannada' :
          langCode === 'ml' ? 'malayalam' :
          langCode === 'mr' ? 'marathi' :
          langCode === 'bn' ? 'bengali' :
          langCode === 'gu' ? 'gujarati' :
          langCode === 'pa' ? 'punjabi' : 'india'
        )
      );

      if (exactMatch) utterance.voice = exactMatch;
      else if (prefixMatch) utterance.voice = prefixMatch;
      else if (nameMatch) utterance.voice = nameMatch;
    }

    utterance.onstart = () => {
      if (callbacks.onStart) callbacks.onStart();
    };

    utterance.onend = () => {
      currentUtterance = null;
      if (callbacks.onEnd) callbacks.onEnd();
    };

    utterance.onerror = (err) => {
      console.warn('TTS Speech synthesis error:', err);
      currentUtterance = null;
      if (callbacks.onError) callbacks.onError(err);
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  };

  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      updateVoiceAndSpeak();
    };
  } else {
    updateVoiceAndSpeak();
  }
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
};

export const pauseSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }
};

export const resumeSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.resume();
  }
};

export const isSpeaking = () => {
  return typeof window !== 'undefined' && window.speechSynthesis ? window.speechSynthesis.speaking : false;
};

/**
 * Parse natural farmer voice query into navigation or intent
 */
export const parseVoiceCommand = (text) => {
  if (!text) return null;
  const lower = text.toLowerCase();

  // Weather Navigation
  if (
    lower.includes('weather') ||
    lower.includes('rain') ||
    lower.includes('வானிலை') ||
    lower.includes('மழை') ||
    lower.includes('వాతావరణం') ||
    lower.includes('వర్షం') ||
    lower.includes('മഴ') ||
    lower.includes('കാലാവസ്ഥ') ||
    lower.includes('ಹವಾಮಾನ') ||
    lower.includes('ಮಳೆ') ||
    lower.includes('मौसम') ||
    lower.includes('बारिश')
  ) {
    return { type: 'navigate', route: '/features?tab=weather', label: 'Weather Radar' };
  }

  // Water / Irrigation
  if (
    lower.includes('water') ||
    lower.includes('irrigation') ||
    lower.includes('தண்ணீர்') ||
    lower.includes('பாசனம்') ||
    lower.includes('నీరు') ||
    lower.includes('నీటిపారుదల') ||
    lower.includes('വെള്ളം') ||
    lower.includes('നനയ്ക്കൽ') ||
    lower.includes('ನೀರು') ||
    lower.includes('ನೀರಾವರಿ') ||
    lower.includes('पानी') ||
    lower.includes('सिंचाई')
  ) {
    return { type: 'navigate', route: '/features?tab=water', label: 'Water Advice' };
  }

  // Crop / Seeds
  if (
    lower.includes('crop') ||
    lower.includes('seed') ||
    lower.includes('fertilizer') ||
    lower.includes('பயிர்') ||
    lower.includes('உரம்') ||
    lower.includes('పంట') ||
    lower.includes('ఎరువులు') ||
    lower.includes('വിള') ||
    lower.includes('വളം') ||
    lower.includes('ಬೆಳೆ') ||
    lower.includes('ಗೊಬ್ಬರ') ||
    lower.includes('फसल') ||
    lower.includes('खाद')
  ) {
    return { type: 'navigate', route: '/features?tab=crops', label: 'Crop Advice' };
  }

  // Marketplace / Sell
  if (
    lower.includes('market') ||
    lower.includes('sell') ||
    lower.includes('price') ||
    lower.includes('mandi') ||
    lower.includes('சந்தை') ||
    lower.includes('விற்பனை') ||
    lower.includes('ధర') ||
    lower.includes('మండి') ||
    lower.includes('വിപണി') ||
    lower.includes('വില') ||
    lower.includes('ಮಾರುಕಟ್ಟೆ') ||
    lower.includes('ದರ') ||
    lower.includes('मंडी') ||
    lower.includes('दाम')
  ) {
    return { type: 'navigate', route: '/marketplace', label: 'Marketplace' };
  }

  // Camera / Show Crop
  if (
    lower.includes('camera') ||
    lower.includes('photo') ||
    lower.includes('leaf') ||
    lower.includes('disease') ||
    lower.includes('புகைப்படம்') ||
    lower.includes('இலை') ||
    lower.includes('ఫోటో') ||
    lower.includes('ఆకు') ||
    lower.includes('ഫോട്ടോ') ||
    lower.includes('ഇല') ||
    lower.includes('ಫೋಟೋ') ||
    lower.includes('ಎಲೆ') ||
    lower.includes('तस्वीर') ||
    lower.includes('पत्ती')
  ) {
    return { type: 'camera', label: 'Show Crop' };
  }

  // General Question
  return { type: 'query', text };
};
