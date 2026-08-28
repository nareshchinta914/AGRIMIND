import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const Toast = ({ id, message, type = 'info', duration = 4000, onClose }) => {
  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-skyAgri-600 flex-shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500 bg-white shadow-emerald-900/10',
    error: 'border-red-500 bg-white shadow-red-900/10',
    warning: 'border-amber-500 bg-white shadow-amber-900/10',
    info: 'border-skyAgri-500 bg-white shadow-skyAgri-900/10',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`flex items-start justify-between gap-3 p-4 rounded-xl border-l-4 shadow-xl border ${borders[type]} transition-all`}
    >
      <div className="flex items-start gap-3">
        {icons[type]}
        <p className="text-sm font-medium text-slate-800 leading-snug">{message}</p>
      </div>

      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 transition-colors -mr-1 -mt-1 p-1 rounded-md hover:bg-slate-100"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default Toast;
