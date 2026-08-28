import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import LanguageSelectorModal from './LanguageSelectorModal';

const LanguageSelector = () => {
  const { language, languages } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-3.5 py-2 text-sm font-black text-slate-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl transition-all shadow-sm cursor-pointer"
        aria-label="Select Language"
      >
        <Globe className="w-4 h-4 text-emerald-600 animate-pulse" />
        <span className="font-display font-black text-slate-900">{currentLang.nativeName}</span>
      </button>

      <LanguageSelectorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default LanguageSelector;
