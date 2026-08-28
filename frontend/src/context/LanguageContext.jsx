import React, { createContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';
import { LANGUAGES } from '../utils/constants';
import { speakText, stopSpeech } from '../utils/speechUtils';

export const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('agrimind_lang') || 'en'; // Default to English or saved preference
  });

  useEffect(() => {
    localStorage.setItem('agrimind_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  const t = (key) => {
    const dict = translations[language] || translations['en'] || {};
    return dict[key] || translations['en']?.[key] || key;
  };

  const changeLanguage = (langCode, previewAudio = false) => {
    setLanguage(langCode);
    if (previewAudio) {
      const selected = LANGUAGES.find((l) => l.code === langCode);
      if (selected?.greeting) {
        speakText(selected.greeting, langCode);
      }
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        currentLang,
        languages: LANGUAGES,
        changeLanguage,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
