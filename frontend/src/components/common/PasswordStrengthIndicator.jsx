import React from 'react';
import { Check, X, ShieldCheck, ShieldAlert } from 'lucide-react';
import { getPasswordStrength } from '../../utils/validators';

const PasswordStrengthIndicator = ({ password = '', showChecklist = true }) => {
  if (!password) return null;

  const {
    checks,
    passedCount,
    isStrong,
    strengthLabel,
    barColor,
    textColor,
    progressPercent
  } = getPasswordStrength(password);

  return (
    <div className="w-full space-y-2 mt-1.5 p-3 rounded-2xl bg-slate-50/90 border border-slate-200/80 transition-all duration-200">
      {/* Top row: Label & Score */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-600 flex items-center gap-1.5">
          {isStrong ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
          )}
          Password Strength:
        </span>
        <span className={`font-black ${textColor} transition-colors duration-200`}>
          {strengthLabel} ({passedCount}/5)
        </span>
      </div>

      {/* 5-Segment Progress Bar */}
      <div className="grid grid-cols-5 gap-1.5 h-1.5 w-full">
        {[1, 2, 3, 4, 5].map((index) => {
          const isFilled = passedCount >= index;
          return (
            <div
              key={index}
              className={`h-full rounded-full transition-all duration-300 ${
                isFilled ? barColor : 'bg-slate-200'
              }`}
            />
          );
        })}
      </div>

      {/* Real-time Requirement Checklist */}
      {showChecklist && (
        <div className="pt-1.5 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
          {checks.map((check) => (
            <div
              key={check.id}
              className={`flex items-center gap-1.5 transition-colors duration-150 ${
                check.met
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-500 font-medium'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] flex-shrink-0 ${
                  check.met
                    ? 'bg-emerald-100 text-emerald-700 font-black'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {check.met ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <span className="w-1 h-1 rounded-full bg-slate-400" />}
              </div>
              <span className={check.met ? 'line-through text-slate-600' : ''}>
                {check.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
