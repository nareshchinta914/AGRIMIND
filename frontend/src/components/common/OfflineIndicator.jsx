import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

const OfflineIndicator = () => {
  const { isOnline, wasOffline } = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-50 bg-amber-500 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2 border border-amber-400"
        >
          <WifiOff className="w-4 h-4 animate-bounce" />
          <span>Offline Mode (Cached Data)</span>
        </motion.div>
      )}

      {isOnline && wasOffline && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-50 bg-emerald-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2 border border-emerald-500"
        >
          <Wifi className="w-4 h-4" />
          <span>Connected Online</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineIndicator;
