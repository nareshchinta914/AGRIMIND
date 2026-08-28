import React, { useState, useEffect } from 'react';
import { Droplets, Clock, CloudSun, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { farmService } from '../../services/farmService';
import StatCard from '../../components/dashboard/StatCard';
import { useAuth } from '../../hooks/useAuth';

const FarmerWaterPage = () => {
  const { user } = useAuth();
  const [waterAdvice, setWaterAdvice] = useState({
    currentSoilMoisture: '34% (Adequate Root Zone Moisture)',
    nextIrrigationTime: 'Tomorrow at 06:30 AM (2h 15m run)',
    durationMinutes: 135,
    waterVolumeLiters: 48000,
    rainfallProbability: '10% (Clear Skies Ahead)',
    waterSavingTip: 'Night/early morning watering prevents 28% evaporative water loss.'
  });

  useEffect(() => {
    const fetchAdvice = async () => {
      const data = await farmService.getWaterAdvice(
        user?.currentCrop || 'Paddy',
        user?.farmSize || 5.0,
        user?.soilType || 'alluvial'
      );
      if (data) setWaterAdvice(data);
    };
    fetchAdvice();
  }, [user]);

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-sky-400 text-slate-950 px-2.5 py-0.5 rounded-full">
            💧 Smart Irrigation
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display mt-1">
            Precision Water & Irrigation Schedule
          </h2>
          <p className="text-xs text-slate-300">
            Automated sensor calculations based on soil type and evapotranspiration
          </p>
        </div>
      </div>

      {/* Water Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Soil Moisture"
          value={waterAdvice.currentSoilMoisture?.split(' ')[0] || '34%'}
          subtitle="Optimal Root Zone"
          icon={Droplets}
          color="sky"
        />
        <StatCard
          title="Next Irrigation"
          value="Tomorrow"
          subtitle="06:30 AM (2h 15m)"
          icon={Clock}
          color="emerald"
        />
        <StatCard
          title="Rain Probability"
          value={waterAdvice.rainfallProbability?.split(' ')[0] || '10%'}
          subtitle="Clear Skies Predicted"
          icon={CloudSun}
          color="amber"
        />
        <StatCard
          title="Water Saved"
          value="48,000"
          unit="Liters"
          subtitle="Via Precision Drip"
          icon={ShieldCheck}
          color="purple"
        />
      </div>

      {/* Critical Irrigation Stages for Standing Crop */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
          <Droplets className="w-5 h-5 text-sky-600" />
          <span>Standing Crop (Paddy / Wheat) Water Milestones</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
            <span className="text-[10px] font-black text-emerald-800 uppercase">Stage 1 (Completed)</span>
            <h4 className="text-sm font-black text-slate-900">Crown Root Initiation (CRI)</h4>
            <p className="text-xs text-slate-600">Day 21 • 2.5 inches water applied</p>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-400 space-y-1 shadow-sm">
            <span className="text-[10px] font-black text-sky-800 uppercase">Stage 2 (Active Current)</span>
            <h4 className="text-sm font-black text-slate-900">Tillering & Booting</h4>
            <p className="text-xs text-slate-600">Day 45 • Scheduled Tomorrow 06:30 AM</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase">Stage 3 (Upcoming)</span>
            <h4 className="text-sm font-black text-slate-900">Flowering & Heading</h4>
            <p className="text-xs text-slate-500">In 20 Days • 2.0 inches water</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase">Stage 4 (Upcoming)</span>
            <h4 className="text-sm font-black text-slate-900">Milking & Grain Fill</h4>
            <p className="text-xs text-slate-500">In 40 Days • Final light irrigation</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 text-xs text-sky-950 flex items-center gap-2 mt-4">
          <AlertCircle className="w-4 h-4 text-sky-600 flex-shrink-0" />
          <span><strong>Conservation Tip:</strong> {waterAdvice.waterSavingTip}</span>
        </div>
      </div>
    </div>
  );
};

export default FarmerWaterPage;
