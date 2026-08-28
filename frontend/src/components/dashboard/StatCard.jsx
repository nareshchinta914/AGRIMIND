import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, unit, subtitle, icon: Icon, trend, color = 'emerald' }) => {
  const colorMap = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    sky: 'bg-sky-50 text-sky-700 border-sky-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-3 transition-all select-none"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-2xl border ${colorMap[color] || colorMap.emerald}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="space-y-0.5">
        <div className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
          {value} {unit && <span className="text-xs text-slate-500 font-normal">{unit}</span>}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-600 font-medium leading-tight">{subtitle}</p>
        )}
      </div>

      {trend && (
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
          <span>{trend}</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
