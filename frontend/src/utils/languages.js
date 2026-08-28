/**
 * AGRIMIND Multilingual Configuration System
 * Expandable to any number of Indian or International languages
 */
export const SUPPORTED_LANGUAGES = [
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    speechCode: 'ta-IN',
    greeting: 'வணக்கம்! 👋',
    speakPrompt: 'பேசுங்கள்',
    direction: 'ltr',
    active: true
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    speechCode: 'te-IN',
    greeting: 'నమస్కారం! 👋',
    speakPrompt: 'మాట్లాడండి',
    direction: 'ltr',
    active: true
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    speechCode: 'hi-IN',
    greeting: 'नमस्ते! 👋',
    speakPrompt: 'बोलिए',
    direction: 'ltr',


    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    speechCode: 'kn-IN',
    greeting: 'ನಮಸ್ಕಾರ! 👋',
    speakPrompt: 'ಮಾತನಾಡಿ',
    direction: 'ltr',
    active: true
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    speechCode: 'ml-IN',
    greeting: 'നമസ്കാരം! 👋',
    speakPrompt: 'സംസാരിക്കൂ',
    direction: 'ltr',
    active: true
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    speechCode: 'mr-IN',
    greeting: 'नमस्कार! 👋',
    speakPrompt: 'बोला',
    direction: 'ltr',
    active: true
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    speechCode: 'bn-IN',
    greeting: 'নমস্কার! 👋',
    speakPrompt: 'বলুন',
    direction: 'ltr',
    active: true
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    speechCode: 'en-IN',
    greeting: 'Hello Farmer! 👋',
    speakPrompt: 'Speak Now',
    direction: 'ltr',
    active: true
  }
];

export const getLanguageByCode = (code) => {
  return SUPPORTED_LANGUAGES.find((lang) => lang.code === code) || SUPPORTED_LANGUAGES[0];
};
