import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sprout,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Volume2,
  VolumeX,
  RotateCcw,
  PhoneCall,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useVoice } from '../../hooks/useVoice';
import { useLanguage } from '../../hooks/useLanguage';
import Button from '../common/Button';

const VisualDiagnosisCard = ({ diagnosis, onReset }) => {
  const { speak, stop, isSpeaking } = useVoice();
  const { t } = useLanguage();

  if (!diagnosis) return null;

  const isLowConfidence = diagnosis.confidence < 70;

  const handleToggleAudio = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(diagnosis.spokenText || `${diagnosis.problem}. ${diagnosis.whatToDo}. ${diagnosis.waterAdvice}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-emerald-500/30 space-y-6 max-w-2xl mx-auto text-left"
    >
      {/* Audio Playback Bar at Top */}
      <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleAudio}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 cursor-pointer ${
              isSpeaking ? 'bg-amber-600 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
            title="Read Aloud"
          >
            {isSpeaking ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
          <div>
            <p className="text-sm font-black text-slate-900 font-display">
              {isSpeaking ? 'விளக்கம் ஒலிக்கிறது...' : 'பதிலை குரல் மூலம் கேளுங்கள்'}
            </p>
            <p className="text-xs text-slate-500">
              {isSpeaking ? 'Speaking audio advisory...' : 'Tap to hear audio explanation'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => speak(diagnosis.spokenText)}
          className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
          title="Replay Audio"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Diagnosis Summary Header */}
      <div className="space-y-3 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('cropLabel')}</p>
              <h3 className="text-2xl font-black text-slate-900 font-display">{diagnosis.crop}</h3>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('confidenceLabel')}</p>
            <span
              className={`text-lg font-black font-display px-3 py-1 rounded-xl inline-block ${
                isLowConfidence
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {diagnosis.confidence}%
            </span>
          </div>
        </div>

        {/* Possible Problem Box */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              {t('problemLabel')}
            </p>
            <p className="text-lg font-black text-slate-900 font-display mt-0.5">
              {diagnosis.problem}
            </p>
            {diagnosis.symptoms && (
              <p className="text-xs text-slate-600 mt-1">{diagnosis.symptoms}</p>
            )}
          </div>
        </div>
      </div>

      {/* Low Confidence Warning if applicable */}
      {isLowConfidence && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">AGRIMIND is not completely sure about this photo.</p>
            <p className="mt-0.5">Please take another closer, clearer photo or contact the Kisan Helpline.</p>
          </div>
        </div>
      )}

      {/* Action Guidance Blocks */}
      <div className="grid gap-3.5">
        {/* 💡 What to do */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">💡</span>
          <div>
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              {t('whatToDoLabel')}
            </p>
            <p className="text-sm font-bold text-slate-900 mt-1 leading-relaxed">
              {diagnosis.whatToDo}
            </p>
          </div>
        </div>

        {/* 💧 Water Advice */}
        <div className="p-4 rounded-2xl bg-skyAgri-50/60 border border-skyAgri-200 flex items-start gap-3">
          <Droplets className="w-6 h-6 text-skyAgri-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-skyAgri-800 uppercase tracking-wider">
              {t('waterLabel')}
            </p>
            <p className="text-sm font-semibold text-slate-800 mt-1 leading-relaxed">
              {diagnosis.waterAdvice}
            </p>
          </div>
        </div>

        {/* ⚠️ Important Notice */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">⚠️</span>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('importantWarningLabel')}
            </p>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">
              {diagnosis.importantNotice}
            </p>
          </div>
        </div>
      </div>

      {/* Farmer Toll-Free Helpline Direct Dial */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">Kisan Toll-Free Helpline</p>
            <a href="tel:18001801551" className="text-lg font-black text-emerald-400 hover:underline">
              1800-180-1551
            </a>
          </div>
        </div>

        {onReset && (
          <Button variant="ghost" size="sm" onClick={onReset} className="text-white hover:bg-white/10">
            Check Another
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default VisualDiagnosisCard;
