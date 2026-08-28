import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Sparkles } from 'lucide-react';
import { useVoice } from '../../hooks/useVoice';
import { useLanguage } from '../../hooks/useLanguage';

const FloatingVoiceButton = () => {
  const { openAssistant, isSpeaking } = useVoice();
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={openAssistant}
        className="relative group flex items-center gap-3 px-6 py-4 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white font-extrabold text-base sm:text-lg shadow-2xl shadow-emerald-600/50 border-2 border-emerald-300/40 cursor-pointer overflow-hidden"
        aria-label="Ask AGRIMIND Voice Assistant"
      >
        {/* Pulsing glow background rings */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400/30 animate-ping pointer-events-none opacity-60"></span>

        <div className="relative w-9 h-9 rounded-full bg-white text-emerald-700 flex items-center justify-center shadow-md">
          <Mic className="w-5 h-5 animate-pulse" />
        </div>

        <div className="relative flex flex-col text-left">
          <span className="leading-tight text-white font-black tracking-wide drop-shadow">
            {t('askAgrimind')}
          </span>
          <span className="text-[10px] text-emerald-100 font-semibold tracking-wider uppercase">
            {t('speakNow')}
          </span>
        </div>

        <Sparkles className="w-4 h-4 text-sunAmber-300 animate-spin" style={{ animationDuration: '8s' }} />
      </motion.button>
    </div>
  );
};

export default FloatingVoiceButton;
