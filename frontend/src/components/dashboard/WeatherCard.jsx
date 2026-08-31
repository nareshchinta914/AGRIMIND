import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CloudSun, Droplets, Wind, Sun, CloudRain, RefreshCw } from 'lucide-react';
import { weatherService } from '../../services/weatherService';

const WeatherCard = ({
  location = 'Thanjavur, Tamil Nadu',
  temp,
  condition,
  humidity,
  wind
}) => {
  const [weatherData, setWeatherData] = useState({
    location: location || 'Thanjavur, Tamil Nadu',
    temp: temp || '30°C',
    condition: condition || 'Partly Cloudy',
    humidity: humidity || '62%',
    wind: wind || '12 km/h',
    rainProbability: '10%',
    sprayAdvisory: 'Optimal weather for field spraying before 10:30 AM',
    lastUpdatedFormatted: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchWeather = async () => {
    setIsLoading(true);
    try {
      const parts = location ? location.split(',') : ['Thanjavur', 'Tamil Nadu'];
      const district = parts[0]?.trim() || 'Thanjavur';
      const state = parts[1]?.trim() || 'Tamil Nadu';
      
      const data = await weatherService.getCurrentWeather({ state, district, location });
      if (data) {
        setWeatherData({
          location: data.location || location,
          temp: data.temperature ? `${data.temperature}°C` : (temp || '30°C'),
          condition: data.condition || (condition || 'Partly Cloudy'),
          humidity: data.humidity ? `${data.humidity}%` : (humidity || '62%'),
          wind: data.windSpeed || (wind || '12 km/h'),
          rainProbability: `${data.rainProbability ?? 10}%`,
          sprayAdvisory: data.sprayAdvisory || 'Optimal conditions for crop spraying',
          lastUpdatedFormatted: data.lastUpdatedFormatted || ''
        });
      }
    } catch (err) {
      console.warn('WeatherCard fetch fallback:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [location]);

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="p-6 rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 text-white shadow-xl space-y-4 select-none relative overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full text-white">
              Live Weather
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
          </div>
          <h4 className="text-xl font-black font-display text-white mt-1 truncate max-w-[220px]">
            {weatherData.location}
          </h4>
        </div>
        <button
          type="button"
          onClick={fetchWeather}
          className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors text-yellow-100 cursor-pointer"
          title="Refresh Live Weather"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex items-baseline justify-between">
        <div className="text-4xl sm:text-5xl font-black font-display text-white">
          {weatherData.temp}
        </div>
        <span className="text-xs sm:text-sm font-bold text-yellow-100 truncate max-w-[170px] text-right">
          {weatherData.condition}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/20 text-xs">
        <div className="flex items-center gap-2 bg-white/10 p-2 rounded-xl">
          <Droplets className="w-4 h-4 text-sky-200 flex-shrink-0" />
          <span className="truncate">Humidity: <strong>{weatherData.humidity}</strong></span>
        </div>
        <div className="flex items-center gap-2 bg-white/10 p-2 rounded-xl">
          <Wind className="w-4 h-4 text-yellow-200 flex-shrink-0" />
          <span className="truncate">Wind: <strong>{weatherData.wind}</strong></span>
        </div>
      </div>

      <div className="text-[11px] font-medium bg-black/20 p-2.5 rounded-xl flex items-start gap-2">
        <span>🌾 <strong>Advisory:</strong> {weatherData.sprayAdvisory}</span>
      </div>
    </motion.div>
  );
};

export default WeatherCard;
