import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import {
  speakText,
  stopSpeech,
  isSpeaking as checkIsSpeaking,
  VOICE_SUPPORTED_LANGUAGES,
  detectLanguageFromText
} from '../utils/speechUtils';

export const VoiceContext = createContext(null);

export const VoiceProvider = ({ children }) => {
  const { language: appLanguage } = useLanguage();
  const [voiceLanguage, setVoiceLanguage] = useState(appLanguage || 'en');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechState, setSpeechState] = useState('idle'); // 'idle' | 'listening' | 'processing' | 'speaking'
  const [activeSpeechText, setActiveSpeechText] = useState('');
  const [speechError, setSpeechError] = useState(null);

  // Synchronize default voice language when global language changes
  useEffect(() => {
    if (appLanguage) {
      setVoiceLanguage(appLanguage);
    }
  }, [appLanguage]);

  const openAssistant = () => {
    setIsAssistantOpen(true);
  };

  const closeAssistant = () => {
    stopSpeech();
    setIsSpeaking(false);
    setSpeechState('idle');
    setIsAssistantOpen(false);
  };

  const openCamera = () => {
    setIsCameraOpen(true);
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
  };

  const speak = useCallback(
    (text, targetLang, callbacks = {}) => {
      if (!text) return;
      const detected = detectLanguageFromText(text);
      const langToUse = targetLang || (detected !== 'en' ? detected : voiceLanguage) || 'en';
      
      setActiveSpeechText(text);
      setIsSpeaking(true);
      setSpeechState('speaking');
      setSpeechError(null);

      speakText(text, langToUse, {
        onStart: () => {
          setIsSpeaking(true);
          setSpeechState('speaking');
          if (callbacks.onStart) callbacks.onStart();
        },
        onEnd: () => {
          setIsSpeaking(false);
          setSpeechState('idle');
          if (callbacks.onEnd) callbacks.onEnd();
        },
        onError: (err) => {
          setIsSpeaking(false);
          setSpeechState('idle');
          if (callbacks.onError) callbacks.onError(err);
        },
      });
    },
    [voiceLanguage]
  );

  const stop = useCallback(() => {
    stopSpeech();
    setIsSpeaking(false);
    setSpeechState('idle');
  }, []);

  const replay = useCallback(() => {
    if (activeSpeechText) {
      speak(activeSpeechText, voiceLanguage);
    }
  }, [activeSpeechText, voiceLanguage, speak]);

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
        speechState,
        setSpeechState,
        voiceLanguage,
        setVoiceLanguage,
        supportedLanguages: VOICE_SUPPORTED_LANGUAGES,
        speechError,
        setSpeechError,
        speak,
        stop,
        stopSpeaking: stop,
        replay,
        activeSpeechText,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

