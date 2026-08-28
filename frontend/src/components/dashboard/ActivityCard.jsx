import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Calendar, ArrowRight } from 'lucide-react';

const ActivityCard = ({ activity }) => {
  if (!activity) return null;

  const categoryIcons = {
    Water: '💧',
    Fertilizer: '🧪',
    'Field Care': '🌿',
    Harvest: '🌾'
  };

  const title = activity.title || 'Farm Activity';
  const status = activity.status || 'Pending';
  const category = activity.category || 'Field Care';
  const plot = activity.plot || 'Main Plot';
  const details = activity.details || 'Regular field management';
  const time = activity.time || 'Today';
  const date = activity.date || '';

  return (
    <motion.div
      whileHover={{ x: 3 }}
      className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none"
    >
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-lg shadow-inner flex-shrink-0">
          {categoryIcons[category] || '🌱'}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-black text-slate-900 font-display">{title}</h4>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              status === 'Completed'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-900'
            }`}>
              {status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{plot} • {details}</p>
        </div>
      </div>

      <div className="text-left sm:text-right flex-shrink-0 text-xs font-bold text-slate-600">
        <span className="flex items-center gap-1 text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          <span>{time}</span>
        </span>
        {date && <span className="text-[11px] text-emerald-700 font-black">{date}</span>}
      </div>
    </motion.div>
  );
};

export default ActivityCard;
