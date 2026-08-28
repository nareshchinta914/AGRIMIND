import React, { useEffect, useState } from 'react';
import { CloudRain, Sun, CloudSun, Wind, Droplets, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { weatherService } from '../../services/weatherService';
import { useLocation } from '../../hooks/useLocation';

const WeatherWidget = () => {
  const { selectedState, selectedDistrict } = useLocation();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const data = await weatherService.getCurrentWeather({
          state: selectedState,
          district: selectedDistrict,
        });
        setWeather(data);
      } catch (err) {
        console.error('Failed to fetch weather:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [selectedState, selectedDistrict]);

  if (loading || !weather) {
    return (
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md animate-pulse">
        <div className="h-6 w-36 bg-slate-200 rounded mb-4"></div>
        <div className="h-10 w-24 bg-slate-200 rounded mb-2"></div>
        <div className="h-4 w-48 bg-slate-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-gradient-to-br from-skyAgri-900 to-slate-900 text-white p-6 sm:p-7 shadow-xl border border-skyAgri-800/40 relative overflow-hidden">
      {/* Background radial sun glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sunAmber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-skyAgri-300">
            Agri-Weather & Forecast
          </span>
          <h4 className="text-xl font-bold font-display text-white">{weather.location}</h4>
        </div>
        <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-sunAmber-400">
          <CloudSun className="w-8 h-8" />
        </div>
      </div>

      {/* Main Temperature & Condition */}
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-4xl sm:text-5xl font-black font-display text-white">
          {weather.temperature}°C
        </span>
        <span className="text-sm font-semibold text-slate-300">
          {weather.condition}
        </span>
      </div>

      {/* Weather Parameters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Droplets className="w-3.5 h-3.5 text-skyAgri-400" />
            <span>Humidity</span>
          </div>
          <p className="text-sm font-bold text-white">{weather.humidity}%</p>
        </div>

        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Wind className="w-3.5 h-3.5 text-slate-300" />
            <span>Wind</span>
          </div>
          <p className="text-sm font-bold text-white">{weather.windSpeed}</p>
        </div>

        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <CloudRain className="w-3.5 h-3.5 text-skyAgri-300" />
            <span>Rain Risk</span>
          </div>
          <p className="text-sm font-bold text-white">{weather.rainfallChance}%</p>
        </div>

        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Sun className="w-3.5 h-3.5 text-sunAmber-400" />
            <span>Soil Moisture</span>
          </div>
          <p className="text-sm font-bold text-white">{weather.soilMoisture?.split(' ')[0] || '71%'}</p>
        </div>
      </div>

      {/* Spraying Advisory Alert Pill */}
      <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-start gap-2.5">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
            Field Spraying Advisory
          </p>
          <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">
            {weather.sprayingAdvisory}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
