// Web Speech API wrapper for Speech-to-Text (STT) and Text-to-Speech (TTS)
import { LANGUAGES } from './constants';

// BCP-47 speech codes mapping
export const LANG_SPEECH_CODES = {
  ta: 'ta-IN',
  te: 'te-IN',
  hi: 'hi-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  en: 'en-IN'
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
 * Initialize Web Speech Recognition
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
  recognition.lang = LANG_SPEECH_CODES[language] || 'en-IN';

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

    if (onResult) {
      onResult({
        final: finalTranscript,
        interim: interimTranscript,
        transcript: finalTranscript || interimTranscript,
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

  const cleanText = text.replace(/[*#_`]/g, '').trim();
  const utterance = new SpeechSynthesisUtterance(cleanText);
  const speechLang = LANG_SPEECH_CODES[language] || 'en-IN';
  utterance.lang = speechLang;
  utterance.rate = 0.95; // Slightly slower, clear cadence for rural farmers
  utterance.pitch = 1.0;

  // Try to match native Indian regional voice if installed
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(
    (v) => v.lang.toLowerCase().replace('_', '-') === speechLang.toLowerCase()
  );
  if (matchedVoice) {
    utterance.voice = matchedVoice;
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

export const stopSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
};

export const pauseSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }
};

export const resumeSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.resume();
  }
};

export const isSpeaking = () => {
  return window.speechSynthesis ? window.speechSynthesis.speaking : false;
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
    lower.includes('तस्वीर') ||
    lower.includes('पत्ती')
  ) {
    return { type: 'camera', label: 'Show Crop' };
  }

  // General Question
  return { type: 'query', text };
};
