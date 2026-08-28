import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Volume2, Check, X } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const LanguageSelectorModal = ({ isOpen, onClose }) => {
  const { language, changeLanguage, languages } = useLanguage();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 font-display">
                  {languages.find(l => l.code === language)?.nativeName || 'தமிழ்'}
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Select Language
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Large Visual Language Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3.5 max-h-[60vh] overflow-y-auto p-1">
            {languages.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    changeLanguage(lang.code, true);
                    onClose();
                  }}
                  className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col justify-between gap-3 relative cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/80 shadow-lg shadow-emerald-600/15 scale-[1.02]'
                      : 'border-slate-200 bg-white hover:border-emerald-400 hover:bg-slate-50 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-2xl font-black text-slate-900 block font-display">
                        {lang.nativeName}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 block mt-0.5">
                        {lang.name}
                      </span>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isSelected ? <Check className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-lg self-start">
                    {lang.greeting}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">
              💡 Tapping a language will also speak a friendly voice greeting.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LanguageSelectorModal;
