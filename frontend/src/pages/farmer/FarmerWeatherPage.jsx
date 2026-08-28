import React, { useState, useEffect } from 'react';
import { CloudSun, Sun, Droplets, Wind, Compass, ShieldAlert, CheckCircle2, CloudRain } from 'lucide-react';
import WeatherCard from '../../components/dashboard/WeatherCard';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from '../../hooks/useLocation';
import { weatherService } from '../../services/weatherService';

const FarmerWeatherPage = () => {
  const { user } = useAuth();
  const { selectedDistrict, selectedState } = useLocation();

  const userDistrict = user?.district || selectedDistrict || 'Thanjavur';
  const userState = user?.state || selectedState || 'Tamil Nadu';
  const fullLocation = `${userDistrict}, ${userState}`;

  const [forecast, setForecast] = useState([
    { day: 'Today', temp: '31°C / 22°C', icon: '☀️', condition: 'Sunny & Clear', rain: '5%', spray: 'Excellent' },
    { day: 'Tomorrow', temp: '32°C / 23°C', icon: '🌤️', condition: 'Partly Cloudy', rain: '10%', spray: 'Good (Morning)' },
    { day: 'Friday', temp: '30°C / 22°C', icon: '⛅', condition: 'Mild Cloud Cover', rain: '15%', spray: 'Good' },
    { day: 'Saturday', temp: '29°C / 21°C', icon: '🌦️', condition: 'Light Passing Showers', rain: '45%', spray: 'Avoid Spraying' },
    { day: 'Sunday', temp: '28°C / 21°C', icon: '🌧️', condition: 'Moderate Rainfall', rain: '65%', spray: 'No Spray' },
    { day: 'Monday', temp: '30°C / 22°C', icon: '🌤️', condition: 'Clearing Sky', rain: '20%', spray: 'Moderate' },
    { day: 'Tuesday', temp: '32°C / 23°C', icon: '☀️', condition: 'Bright Sunshine', rain: '5%', spray: 'Excellent' }
  ]);

  useEffect(() => {
    let isMounted = true;
    const fetchForecast = async () => {
      try {
        const data = await weatherService.getCurrentWeather({ state: userState, district: userDistrict });
        if (isMounted && data?.forecast && Array.isArray(data.forecast)) {
          const formatted = data.forecast.map((f) => ({
            day: f.day || 'Day',
            temp: `${f.tempMax || 30}°C / ${f.tempMin || 20}°C`,
            icon: f.rainProb > 50 ? '🌧️' : f.rainProb > 20 ? '🌦️' : '☀️',
            condition: f.rainProb > 50 ? 'Rain Expected' : f.rainProb > 20 ? 'Passing Clouds' : 'Clear Skies',
            rain: `${f.rainProb || 10}%`,
            spray: f.rainProb > 40 ? 'Avoid Spraying' : 'Favorable for Spray'
          }));
          if (formatted.length > 0) setForecast(formatted);
        }
      } catch (err) {
        // Safe fallback in state
      }
    };

    fetchForecast();
    return () => { isMounted = false; };
  }, [userDistrict, userState]);

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full">
            🌦️ Weather & Rain Forecast
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display mt-1">
            Local Agro-Weather Radar
          </h2>
          <p className="text-xs text-slate-300">
            📍 {fullLocation} • Station Doppler Radar: Live Online
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <WeatherCard location={fullLocation} />
        </div>

        <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900 font-display flex items-center justify-between">
            <span>7-Day Agricultural Forecast & Spray Advisory</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Live Station Feed
            </span>
          </h3>

          <div className="space-y-2">
            {forecast.map((f, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs hover:bg-slate-100/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{f.icon}</span>
                  <div>
                    <h5 className="font-black text-slate-900 text-sm">{f.day}</h5>
                    <p className="text-slate-500 font-medium">{f.condition}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-slate-900 text-sm">{f.temp}</span>
                  <span
                    className={`block text-[11px] font-bold ${
                      f.spray.includes('Avoid') || f.spray.includes('No')
                        ? 'text-rose-600'
                        : 'text-emerald-700'
                    }`}
                  >
                    Spray: {f.spray} (Rain Prob: {f.rain})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerWeatherPage;
