import React from 'react';
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
  Sparkles,
  FlaskConical,
  HelpCircle,
  ShieldCheck,
  Info
} from 'lucide-react';
import { useVoice } from '../../hooks/useVoice';
import { useLanguage } from '../../hooks/useLanguage';
import Button from '../common/Button';

const VisualDiagnosisCard = ({ diagnosis, onReset }) => {
  const { speak, stop, isSpeaking } = useVoice();
  const { language, t } = useLanguage();

  if (!diagnosis) return null;

  const isConfirmed = diagnosis.diagnosisType === 'CONFIRMED' && diagnosis.confidence >= 80;
  const isPossible = !isConfirmed;

  const handleToggleAudio = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(diagnosis.spokenText || `${diagnosis.problem}. ${diagnosis.whatToDo}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border-2 border-emerald-500/30 space-y-5 max-w-2xl mx-auto text-left"
    >
      {/* Audio Playback Header Bar */}
      <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleAudio}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 cursor-pointer ${
              isSpeaking ? 'bg-amber-600 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
            title="Read Aloud"
          >
            {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <div>
            <p className="text-xs font-black text-slate-900 font-display">
              {isSpeaking ? 'விளக்கம் ஒலிக்கிறது...' : 'குரல் வழிகாட்டுதல் (Audio Advisory)'}
            </p>
            <p className="text-[11px] text-slate-500">
              {isSpeaking ? 'Speaking natural audio...' : 'Tap to hear advice spoken in your language'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => speak(diagnosis.spokenText)}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Replay Audio"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Disease Diagnosis & Status Badge */}
      <div className="space-y-3 pb-3 border-b border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🌿</span>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Affected Crop</p>
              <h3 className="text-xl font-black text-slate-900 font-display">{diagnosis.crop}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isConfirmed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                Detected Disease ({diagnosis.confidence}%)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 shadow-sm">
                <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                Possible / Uncertain Disease ({diagnosis.confidence}%)
              </span>
            )}
          </div>
        </div>

        {/* Condition Box */}
        <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
          isConfirmed ? 'bg-amber-50/90 border-amber-200' : 'bg-orange-50/90 border-orange-200'
        }`}>
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-amber-800">
              {isConfirmed ? 'Verified Crop Condition' : 'Potential Crop Condition (Unconfirmed)'}
            </p>
            <p className="text-base font-black text-slate-900 font-display">
              {diagnosis.problem}
            </p>
            {diagnosis.symptoms && (
              <p className="text-xs text-slate-700 leading-relaxed pt-0.5">
                <span className="font-bold">Visible Symptoms:</span> {diagnosis.symptoms}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* STEP 4: FERTILIZER & NUTRIENT RECOMMENDATION */}
      {diagnosis.fertilizer && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-emerald-600" />
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide font-display">
              Recommended Fertilizer & Nutrient Recipe
            </h4>
          </div>

          <div className="grid gap-3">
            {/* Recommended Product & Why */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wide">
                  Nutrient / Fertilizer
                </span>
                <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md">
                  Targeted Formula
                </span>
              </div>
              <p className="text-base font-black text-slate-900">
                {diagnosis.fertilizer.name}
              </p>
              <p className="text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-emerald-950">Why Recommended:</span> {diagnosis.fertilizer.whyRecommended}
              </p>
            </div>

            {/* Application & Dosage Guidance */}
            <div className="p-4 rounded-2xl bg-skyAgri-50/70 border border-skyAgri-200 space-y-1">
              <span className="text-[11px] font-black text-skyAgri-900 uppercase tracking-wide flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-skyAgri-700" />
                Dosage & Application Guidance
              </span>
              <p className="text-xs font-semibold text-slate-800 leading-relaxed pt-1">
                {diagnosis.fertilizer.dosage}
              </p>
            </div>

            {/* Important Precautions */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-wide flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-slate-500" />
                Important Precautions
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {diagnosis.fertilizer.precautions}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Buttons & Helpline */}
      <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Kisan Toll-Free Helpline</p>
            <a href="tel:18001801551" className="text-base font-black text-emerald-400 hover:underline">
              1800-180-1551
            </a>
          </div>
        </div>

        {onReset && (
          <Button
            variant="primary"
            size="sm"
            onClick={onReset}
            className="!px-4 !py-2 text-xs font-bold cursor-pointer"
          >
            Capture Again
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default VisualDiagnosisCard;
