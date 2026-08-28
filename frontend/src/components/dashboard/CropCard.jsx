import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, TrendingUp, ShieldCheck, Droplets } from 'lucide-react';

const CropCard = ({ cropName, variety, stage, expectedYield, healthScore = 98, nextAction }) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 select-none"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold">
            🌾
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
              Standing Crop
            </span>
            <h4 className="text-lg font-black text-slate-900 font-display">{cropName}</h4>
            <p className="text-xs text-slate-500 font-medium">{variety}</p>
          </div>
        </div>

        <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
          {healthScore}% Healthy
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
        <div className="space-y-0.5">
          <span className="text-slate-500 font-bold uppercase text-[10px]">Crop Stage</span>
          <p className="font-bold text-slate-900">{stage || 'Vegetative (Day 45)'}</p>
        </div>

        <div className="space-y-0.5">
          <span className="text-slate-500 font-bold uppercase text-[10px]">Yield Forecast</span>
          <p className="font-bold text-emerald-700">{expectedYield || '24 - 28 Qtl/Acre'}</p>
        </div>
      </div>

      {nextAction && (
        <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2">
          <Droplets className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span><strong>Next Action:</strong> {nextAction}</span>
        </div>
      )}
    </motion.div>
  );
};

export default CropCard;
