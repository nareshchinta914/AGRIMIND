import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sprout,
  Droplets,
  CloudSun,
  Calculator,
  TrendingUp,
  Camera,
  MessageSquare,
  ShieldCheck,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useVoice } from '../hooks/useVoice';
import SoilScannerModal from '../components/soil/SoilScannerModal';
import Button from '../components/common/Button';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const { openCamera, openAssistant } = useVoice();
  const navigate = useNavigate();
  const [isSoilScannerOpen, setIsSoilScannerOpen] = useState(false);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8 select-none">
      {/* Farmer Identity Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-slate-950 px-3 py-0.5 rounded-full">
                🌾 Farmer Control Dashboard
              </span>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> PM-KISAN Verified
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display mt-1">
              Welcome, {user?.name || 'Naresh Chinta'}
            </h1>
            <p className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
              <span>📍 {user?.village ? `${user.village}, ` : ''}{user?.district || 'Thanjavur'}, {user?.state || 'Tamil Nadu'}</span>
              <span>•</span>
              <span>🌱 Soil: {user?.soilType ? user.soilType.toUpperCase() : 'ALLUVIAL LOAM'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            icon={Camera}
            onClick={() => setIsSoilScannerOpen(true)}
            className="shadow-lg shadow-emerald-600/30"
          >
            Scan Soil
          </Button>
          <Link to="/marketplace">
            <Button variant="amber" size="md" icon={TrendingUp}>
              Sell Harvest
            </Button>
          </Link>
        </div>
      </div>

      {/* Farm Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Farm Land Size</span>
          <div className="text-2xl font-black text-slate-900 font-display">
            {user?.farmSize || '5.5'} <span className="text-xs text-slate-500 font-normal">{user?.farmSizeUnit || 'Acres'}</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-bold block">100% Cultivated</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Current Standing Crop</span>
          <div className="text-2xl font-black text-emerald-700 font-display truncate">
            {user?.currentCrop || 'Paddy (Ponni)'}
          </div>
          <span className="text-[11px] text-slate-500 font-bold block">Vegetative Stage • Day 45</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Expected Yield</span>
          <div className="text-2xl font-black text-slate-900 font-display">
            140 <span className="text-xs text-slate-500 font-normal">Quintals</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-bold block">Est. Revenue: ₹3,57,000</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Crop Health Status</span>
          <div className="text-2xl font-black text-emerald-600 font-display">
            98% <span className="text-xs text-emerald-700 font-bold">Healthy</span>
          </div>
          <span className="text-[11px] text-slate-500 block">No Disease Detected</span>
        </div>
      </div>

      {/* Quick Action Operations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Soil Quality Test */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold">
              🌱
            </div>
            <h3 className="text-lg font-black text-slate-900 font-display">
              Soil & NPK Advisory
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Verify your soil structure, NPK balance, and calculate exact fertilizer dosages for upcoming sowing.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsSoilScannerOpen(true)}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>Open Soil Camera Scanner</span>
          </button>
        </div>

        {/* Card 2: Precision Irrigation */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-xl font-bold">
              💧
            </div>
            <h3 className="text-lg font-black text-slate-900 font-display">
              Smart Water Advisory
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Based on local humidity and soil moisture, next watering is scheduled for <strong>Tomorrow 6:30 AM</strong>.
            </p>
          </div>
          <Link to="/features?tab=water">
            <button
              type="button"
              className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <Droplets className="w-4 h-4" />
              <span>View Irrigation Schedule</span>
            </button>
          </Link>
        </div>

        {/* Card 3: Mandi Rates & Millers */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl font-bold">
              📈
            </div>
            <h3 className="text-lg font-black text-slate-900 font-display">
              Live Mandi Rates & Millers
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Paddy price in Thanjavur / Madurai APMC is currently <strong>₹2,450 - ₹2,550/Qtl</strong>.
            </p>
          </div>
          <Link to="/marketplace">
            <button
              type="button"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Browse Live Mandis & Buyers</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Soil Scanner Modal */}
      <SoilScannerModal
        isOpen={isSoilScannerOpen}
        onClose={() => setIsSoilScannerOpen(false)}
      />
    </div>
  );
};

export default FarmerDashboard;
