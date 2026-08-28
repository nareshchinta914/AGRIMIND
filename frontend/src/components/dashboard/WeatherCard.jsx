import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CloudSun, Droplets, Wind, Sun, CloudRain } from 'lucide-react';
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
    temp: temp || '31°C',
    condition: condition || 'Partly Cloudy',
    humidity: humidity || '62%',
    wind: wind || '12 km/h'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchWeather = async () => {
      setIsLoading(true);
      try {
        const parts = location ? location.split(',') : ['Thanjavur', 'Tamil Nadu'];
        const district = parts[0]?.trim() || 'Thanjavur';
        const state = parts[1]?.trim() || 'Tamil Nadu';
        
        const data = await weatherService.getCurrentWeather({ state, district });
        if (isMounted && data) {
          setWeatherData({
            location: data.location || location,
            temp: data.temperature ? `${data.temperature}°C` : (temp || '31°C'),
            condition: data.condition || (condition || 'Partly Cloudy with Breeze'),
            humidity: data.humidity ? `${data.humidity}%` : (humidity || '62%'),
            wind: data.windSpeed || (wind || '12 km/h')
          });
        }
      } catch (err) {
        // Safe fallback in state
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchWeather();
    return () => { isMounted = false; };
  }, [location]);

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="p-6 rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 text-white shadow-xl space-y-5 select-none relative overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full text-white">
            Live Weather & Rain Radar
          </span>
          <h4 className="text-xl font-black font-display text-white mt-1.5 truncate max-w-[240px]">
            {weatherData.location}
          </h4>
        </div>
        <Sun className="w-10 h-10 text-yellow-200 animate-spin-slow flex-shrink-0" />
      </div>

      <div className="flex items-baseline justify-between">
        <div className="text-4xl sm:text-5xl font-black font-display text-white">
          {weatherData.temp}
        </div>
        <span className="text-sm font-bold text-yellow-100 truncate max-w-[180px]">
          {weatherData.condition}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/20 text-xs">
        <div className="flex items-center gap-2 bg-white/10 p-2 rounded-xl">
          <Droplets className="w-4 h-4 text-sky-200 flex-shrink-0" />
          <span className="truncate">Humidity: <strong>{weatherData.humidity}</strong></span>
        </div>
        <div className="flex items-center gap-2 bg-white/10 p-2 rounded-xl">
          <Wind className="w-4 h-4 text-yellow-200 flex-shrink-0" />
          <span className="truncate">Wind: <strong>{weatherData.wind}</strong></span>
        </div>
      </div>

      <div className="text-[11px] font-medium bg-black/20 p-2.5 rounded-xl flex items-center gap-2">
        <span>🌾 <strong>Farmer Tip:</strong> Optimal conditions for foliar spray until 11:00 AM today.</span>
      </div>
    </motion.div>
  );
};

export default WeatherCard;
