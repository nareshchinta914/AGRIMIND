import { useContext } from 'react';
import { OfflineContext } from '../context/OfflineContext';

export const useOnlineStatus = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOnlineStatus must be used within an OfflineProvider');
  }
  return context;
};
