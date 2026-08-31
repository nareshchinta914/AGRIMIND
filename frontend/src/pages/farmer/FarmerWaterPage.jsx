import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplets,
  Clock,
  CloudSun,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  MapPin,
  HelpCircle,
  Thermometer,
  CloudRain,
  Radio,
  Sliders,
  Send,
  Navigation
} from 'lucide-react';
import { waterAdvisoryService, CROP_WATER_SPECS } from '../../services/waterAdvisoryService';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from '../../hooks/useLocation';
import { useToast } from '../../hooks/useToast';
import StatCard from '../../components/dashboard/StatCard';
import Button from '../../components/common/Button';

const FarmerWaterPage = () => {
  const { user } = useAuth();
  const { selectedDistrict, selectedState } = useLocation();
  const { toast } = useToast();

  const defaultLoc = user?.district && user?.state
    ? `${user.district}, ${user.state}`
    : selectedDistrict && selectedState
    ? `${selectedDistrict}, ${selectedState}`
    : 'Thanjavur, Tamil Nadu';

  // Form State
  const [selectedCrop, setSelectedCrop] = useState(user?.currentCrop || 'paddy');
  const [growthStage, setGrowthStage] = useState('Active Tillering / Vegetative');
  const [locationName, setLocationName] = useState(defaultLoc);
  const [coords, setCoords] = useState(null);
  const [soilType, setSoilType] = useState(user?.soilType || 'alluvial');
  const [soilMoisture, setSoilMoisture] = useState('');
  const [irrigationType, setIrrigationType] = useState('drip');
  const [landAcres, setLandAcres] = useState(user?.farmSize || 3);

  // Advisory State
  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchWaterAdvisory = useCallback(
    async (isManual = false) => {
      if (isManual) setIsRefreshing(true);
      else setLoading(true);
      setErrorMessage(null);

      try {
        const res = await waterAdvisoryService.generateWaterAdvisory({
          crop: selectedCrop,
          growthStage,
          location: locationName,
          coords,
          soilType,
          soilMoistureInput: soilMoisture ? Number(soilMoisture) : null,
          irrigationType,
          landAcres: Number(landAcres) || 1
        });

        if (!res.isValid) {
          setErrorMessage(res.message);
          setAdvisory(null);
        } else {
          setAdvisory(res);
          if (isManual) toast.success('Water advisory updated with live weather!');
        }
      } catch (err) {
        console.error('Water advisory fetch error:', err);
        setErrorMessage('Live weather information is currently unavailable. Please try again.');
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [selectedCrop, growthStage, locationName, coords, soilType, soilMoisture, irrigationType, landAcres, toast]
  );

  useEffect(() => {
    fetchWaterAdvisory();
  }, [fetchWaterAdvisory]);

  // GPS Location handler
  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      toast.warning('Geolocation not supported. Please type your location.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setCoords(c);
        setLocationName('Current GPS Coordinates');
        fetchWaterAdvisory();
      },
      (err) => {
        console.warn('GPS denied:', err);
        toast.warning('GPS permission denied. Using selected district.');
        setLoading(false);
      }
    );
  };

  const getDecisionBadgeStyle = (code) => {
    if (code === 'RECOMMENDED') {
      return 'bg-sky-500/10 border-sky-400 text-sky-400';
    }
    if (code === 'DELAY') {
      return 'bg-amber-500/10 border-amber-400 text-amber-400';
    }
    if (code === 'NOT_REQUIRED') {
      return 'bg-emerald-500/10 border-emerald-400 text-emerald-400';
    }
    return 'bg-rose-500/10 border-rose-400 text-rose-400';
  };

  return (
    <div className="space-y-6 select-none max-w-7xl mx-auto w-full">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-sky-400 text-slate-950 px-2.5 py-0.5 rounded-full inline-block mb-1">
            💧 Smart Agricultural Irrigation
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display">
            Precision Water & Irrigation Advisory
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Calibrated against real-time satellite weather, rainfall forecasts & crop evapo-transpiration
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={Navigation}
            onClick={handleUseGPS}
            className="!text-sky-300 hover:!bg-sky-950/50 !border !border-sky-700/50 cursor-pointer"
          >
            Use GPS
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={RefreshCw}
            isLoading={isRefreshing}
            onClick={() => fetchWaterAdvisory(true)}
            className="!bg-sky-500 hover:!bg-sky-400 text-slate-950 font-black cursor-pointer shadow-lg"
          >
            Refresh Live
          </Button>
        </div>
      </div>

      {/* PARAMETERS & CONTROLS FORM */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-600" />
            <span>Farm Inputs & Location</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-semibold">
            {locationName}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Crop Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Standing Crop</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none"
            >
              <option value="paddy">Paddy / Rice (వరి / நெல் / धान)</option>
              <option value="wheat">Wheat (గోధుమ / கோதுமை / गेहूँ)</option>
              <option value="cotton">Cotton (పత్తి / பருத்தி / कपास)</option>
              <option value="maize">Maize / Corn (మొక్కజొన్న / மக்காச்சோளம்)</option>
              <option value="tomato">Tomato / Vegetables (தக்காளி / टमाटर)</option>
              <option value="sugarcane">Sugarcane (చెరకు / கரும்பு)</option>
              <option value="chilli">Chilli (మిరప / மிளகாய்)</option>
            </select>
          </div>

          {/* Growth Stage */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Growth Stage</label>
            <select
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value)}
              className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none"
            >
              <option value="Germination & Seedling">Germination & Seedling (0-20d)</option>
              <option value="Active Tillering / Vegetative">Active Tillering / Vegetative (20-50d)</option>
              <option value="Flowering & Panicle Initiation">Flowering & Heading (50-80d)</option>
              <option value="Milking & Grain Filling">Milking & Grain Fill (80-110d)</option>
              <option value="Maturity & Pre-Harvest">Maturity & Pre-Harvest</option>
            </select>
          </div>

          {/* Irrigation Method */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Irrigation Method</label>
            <select
              value={irrigationType}
              onChange={(e) => setIrrigationType(e.target.value)}
              className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none"
            >
              <option value="drip">Drip Irrigation (90% Water Efficient)</option>
              <option value="sprinkler">Sprinkler System (75% Efficient)</option>
              <option value="flood">Flood / Furrow Channel (55% Efficient)</option>
            </select>
          </div>

          {/* Optional Soil Moisture Sensor */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Soil Moisture Sensor (%) (Optional)</label>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="e.g. 32 (optional)"
              value={soilMoisture}
              onChange={(e) => setSoilMoisture(e.target.value)}
              className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* ERROR STATE */}
      {errorMessage && (
        <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-900 space-y-3">
          <div className="flex items-center gap-2 text-rose-700 font-black">
            <AlertCircle className="w-6 h-6" />
            <h4 className="text-base font-display">Water Advisory Unavailable</h4>
          </div>
          <p className="text-sm font-semibold">{errorMessage}</p>
          <div className="pt-2">
            <Button
              variant="primary"
              size="sm"
              icon={RefreshCw}
              onClick={() => fetchWaterAdvisory(true)}
              className="!bg-rose-600 text-white font-bold"
            >
              Retry Live Weather Check
            </Button>
          </div>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && !errorMessage && (
        <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h4 className="text-sm font-black text-slate-800 font-display">
            Analyzing Live Weather & Evapo-transpiration...
          </h4>
          <p className="text-xs text-slate-500">Checking precipitation probabilities, temperature & soil water retention</p>
        </div>
      )}

      {/* ADVISORY RESULTS */}
      {!loading && advisory && (
        <div className="space-y-6">
          {/* Main Decision Highlight Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-sky-400">
                  Agro-Meteorological Recommendation
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-display mt-1 flex items-center gap-2">
                  <span>{advisory.decision}</span>
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Confidence Index</p>
                  <p className="text-sm font-black text-sky-400">{advisory.confidenceScore}% Reliability</p>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Updated</p>
                  <p className="text-sm font-black text-emerald-400">{advisory.updatedAt}</p>
                </div>
              </div>
            </div>

            {/* Explanation & Rationale */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-1">
                <span className="text-[10px] font-black text-sky-300 uppercase tracking-wider block">
                  Agronomic Reason
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                  {advisory.reason}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-1">
                <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider block">
                  Rainfall Outlook
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                  {advisory.expectedRainText}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-1">
                <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wider block">
                  Optimal Timing
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                  {advisory.suggestedTiming}
                </p>
              </div>
            </div>

            {/* Live Weather Metrics Summary */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300 border-t border-slate-800/60">
              <div className="flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-amber-400" />
                <span>Live Temp: <strong className="text-white">{advisory.currentWeather.temperature}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-sky-400" />
                <span>Humidity: <strong className="text-white">{advisory.currentWeather.humidity}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-indigo-400" />
                <span>Rain Probability: <strong className="text-white">{advisory.currentWeather.rainProbability}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Recent Rain: <strong className="text-white">{advisory.currentWeather.recentRainfall}</strong></span>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              title="Rain Probability"
              value={advisory.currentWeather.rainProbability}
              subtitle="Next 24-48 Hours"
              icon={CloudRain}
              color="sky"
            />
            <StatCard
              title="Optimal Timing"
              value={advisory.suggestedTiming.split(' ')[0] || 'Morning'}
              subtitle={advisory.suggestedTiming.split('(')[1]?.replace(')', '') || '06:00 - 08:30 AM'}
              icon={Clock}
              color="emerald"
            />
            <StatCard
              title="Live Temperature"
              value={advisory.currentWeather.temperature}
              subtitle={advisory.currentWeather.condition}
              icon={Thermometer}
              color="amber"
            />
            <StatCard
              title="Water Volume"
              value={advisory.estimatedVolumeLiters > 0 ? (advisory.estimatedVolumeLiters / 1000).toFixed(1) + 'k' : '0'}
              unit="Liters"
              subtitle={`For ${landAcres} Acres (${irrigationType})`}
              icon={Droplets}
              color="purple"
            />
          </div>

          {/* DATA SOURCES & SENSOR TRANSPARENCY */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600" />
                <span>Data Verification & Transparency (Confidence: {advisory.confidenceScore}%)</span>
              </h4>
              <span className="text-[11px] text-slate-400">Not 100% Guaranteed • Agro-Met Model</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {advisory.dataSources.map((ds, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{ds.name}</span>
                  <p className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {ds.status}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerWaterPage;
