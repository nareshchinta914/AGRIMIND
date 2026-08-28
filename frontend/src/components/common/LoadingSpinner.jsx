import React from 'react';
import { motion } from 'framer-motion';
import { Sprout } from 'lucide-react';

const LoadingSpinner = ({
  message = 'Analyzing farm data...',
  size = 'md',
  fullScreen = false,
}) => {
  const sizeMap = {
    sm: 'w-6 h-6 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-16 h-16 text-lg',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="relative flex items-center justify-center">
        {/* Glowing ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          className="w-14 h-14 rounded-full border-4 border-agri-200 border-t-agri-600 shadow-lg shadow-agri-500/20"
        />
        {/* Pulsing sprout icon inside */}
        <motion.div
          animate={{ scale: [0.85, 1.15, 0.85] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="absolute text-agri-600"
        >
          <Sprout className="w-6 h-6" />
        </motion.div>
      </div>

      {message && (
        <motion.p
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-slate-600 font-medium font-display tracking-wide"
        >
          {message}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
