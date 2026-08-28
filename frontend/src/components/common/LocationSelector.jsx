import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { useLocation } from '../../hooks/useLocation';

const LocationSelector = () => {
  const { selectedState, selectedDistrict, isAutoDetected } = useLocation();

  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-emerald-50/80 border border-emerald-200 rounded-xl transition-all shadow-sm max-w-[220px] select-none"
      title={isAutoDetected ? 'Auto-detected Live GPS Location' : `${selectedDistrict}, ${selectedState}`}
    >
      <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
      <span className="truncate">{selectedDistrict}, {selectedState}</span>
      {isAutoDetected && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" title="GPS Live"></span>
      )}
    </div>
  );
};

export default LocationSelector;
