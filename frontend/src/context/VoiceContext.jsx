import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { speakText, stopSpeech, isSpeaking as checkIsSpeaking } from '../utils/speechUtils';

export const VoiceContext = createContext(null);

export const VoiceProvider = ({ children }) => {
  const { language, t } = useLanguage();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSpeechText, setActiveSpeechText] = useState('');

  const openAssistant = () => {
    setIsAssistantOpen(true);
  };

  const closeAssistant = () => {
    stopSpeech();
    setIsSpeaking(false);
    setIsAssistantOpen(false);
  };

  const openCamera = () => {
    setIsCameraOpen(true);
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
  };

  const speak = useCallback(
    (text, targetLang) => {
      if (!text) return;
      const langToUse = targetLang || language || 'en';
      setActiveSpeechText(text);
      setIsSpeaking(true);
      speakText(text, langToUse, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    },
    [language]
  );

  const stop = () => {
    stopSpeech();
    setIsSpeaking(false);
  };

  const replay = () => {
    if (activeSpeechText) {
      speak(activeSpeechText);
    }
  };

  return (
    <VoiceContext.Provider
      value={{
        isAssistantOpen,
        openAssistant,
        closeAssistant,
        isCameraOpen,
        openCamera,
        closeCamera,
        isSpeaking,
        speak,
        stop,
        replay,
        activeSpeechText,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};
