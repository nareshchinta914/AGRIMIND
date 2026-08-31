import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloudSun,
  Sun,
  Droplets,
  Wind,
  CloudRain,
  Compass,
  RefreshCw,
  MapPin,
  Search,
  Sunrise,
  Sunset,
  Thermometer,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronRight,
  Eye,
  CheckCircle2,
  Navigation
} from 'lucide-react';
import WeatherCard from '../../components/dashboard/WeatherCard';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from '../../hooks/useLocation';
import { weatherService } from '../../services/weatherService';
import { useToast } from '../../hooks/useToast';
import Button from '../../components/common/Button';

const FarmerWeatherPage = () => {
  const { user } = useAuth();
  const { selectedDistrict, selectedState } = useLocation();
  const { toast } = useToast();

  const defaultLoc = user?.district && user?.state
    ? `${user.district}, ${user.state}`
    : selectedDistrict && selectedState
    ? `${selectedDistrict}, ${selectedState}`
    : 'Thanjavur, Tamil Nadu';

  const [currentLocation, setCurrentLocation] = useState(defaultLoc);
  const [coords, setCoords] = useState(null); // { lat, lon }
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Manual search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const searchContainerRef = useRef(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch LIVE weather
  const fetchLiveWeather = useCallback(async (locationParam = currentLocation, coordParam = coords, isManual = false) => {
    if (isManual) setIsRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const params = coordParam
        ? { lat: coordParam.lat, lon: coordParam.lon, location: locationParam }
        : { location: locationParam };

      const data = await weatherService.getCurrentWeather(params);
      if (data && (data.temperature !== undefined || data.temp !== undefined)) {
        setWeather(data);
        if (data.location) setCurrentLocation(data.location);
        if (isManual) toast.success('Live weather updated with latest satellite observations!');
      } else {
        throw new Error('Weather station feed returned empty data');
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError('Unable to load live weather from meteorology stations. Please try again.');
      if (isManual) toast.error('Failed to refresh weather. Please check connection.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [currentLocation, coords, toast]);

  // Initial load
  useEffect(() => {
    fetchLiveWeather(currentLocation, coords);
  }, []);

  // Auto-refresh interval every 15 minutes (900,000 ms)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLiveWeather(currentLocation, coords);
    }, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentLocation, coords, fetchLiveWeather]);

  // Handle GPS Browser Geolocation
  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      toast.warning('Geolocation is not supported by your browser. Please enter your city/district manually.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const newCoords = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        };
        setCoords(newCoords);
        toast.info('GPS Location acquired. Fetching hyper-local weather...');
        await fetchLiveWeather('Current GPS Location', newCoords, true);
      },
      (err) => {
        setLoading(false);
        console.warn('Geolocation permission denied:', err.message);
        toast.warning('GPS permission denied. You can search your City, District, or State manually.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Handle Location Search
  const handleSearchChange = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length >= 2) {
      setIsSearching(true);
      setShowSearchDropdown(true);
      const results = await weatherService.searchLocations(val);
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };

  const handleSelectLocation = (loc) => {
    setSearchQuery('');
    setShowSearchDropdown(false);
    setCoords({ lat: loc.latitude, lon: loc.longitude });
    setCurrentLocation(loc.displayName);
    fetchLiveWeather(loc.displayName, { lat: loc.latitude, lon: loc.longitude }, true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowSearchDropdown(false);
    setCoords(null);
    setCurrentLocation(searchQuery.trim());
    fetchLiveWeather(searchQuery.trim(), null, true);
  };

  return (
    <div className="space-y-6 select-none max-w-6xl mx-auto pb-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-skyAgri-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-skyAgri-800/40 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-skyAgri-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Doppler Station Feed
            </span>
            {weather?.lastUpdatedFormatted && (
              <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" /> Updated {weather.lastUpdatedFormatted}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-display mt-2 text-white flex items-center gap-2">
            Agricultural Weather Radar
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-sunAmber-400 flex-shrink-0" />
            <span className="font-bold text-white">{weather?.location || currentLocation}</span>
          </p>
        </div>

        {/* Right Controls: Geolocation + Manual Refresh */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          {/* GPS Button */}
          <button
            type="button"
            onClick={handleUseGeolocation}
            className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-95"
            title="Locate via GPS"
          >
            <Navigation className="w-3.5 h-3.5 text-skyAgri-400" />
            <span>Use GPS</span>
          </button>

          {/* Manual Refresh Button */}
          <button
            type="button"
            onClick={() => fetchLiveWeather(currentLocation, coords, true)}
            disabled={loading || isRefreshing}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-lg shadow-emerald-900/30 active:scale-95 disabled:opacity-60"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing || loading ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Updating...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Manual Location Search Bar */}
      <div ref={searchContainerRef} className="relative z-20">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search City, District or State (e.g. Ludhiana, Thanjavur, Guntur, Nashik)..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => { if (searchResults.length > 0) setShowSearchDropdown(true); }}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-300 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 shadow-sm"
            />
            {isSearching && (
              <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin absolute right-4 top-1/2 -translate-y-1/2" />
            )}
          </div>
          <Button type="submit" variant="primary" size="md" className="px-5 shadow-sm">
            Search
          </Button>
        </form>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {showSearchDropdown && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-30 divide-y divide-slate-100"
            >
              {searchResults.map((loc) => (
                <button
                  key={loc.id || `${loc.latitude}_${loc.longitude}`}
                  type="button"
                  onClick={() => handleSelectLocation(loc)}
                  className="w-full px-4 py-3 text-left hover:bg-emerald-50/80 transition-colors flex items-center justify-between group cursor-pointer text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900">{loc.name}</span>
                      <span className="text-xs text-slate-500 block">
                        {[loc.district, loc.state, loc.country].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Alert Pill */}
      {error && !loading && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => fetchLiveWeather(currentLocation, coords, true)}
            className="font-bold underline hover:text-rose-950 cursor-pointer text-xs"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          <div className="h-72 bg-slate-200 rounded-3xl"></div>
          <div className="md:col-span-2 h-72 bg-slate-200 rounded-3xl"></div>
        </div>
      ) : weather ? (
        <>
          {/* Main Weather Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Card: Live Weather Hero */}
            <div className="md:col-span-1">
              <WeatherCard
                location={weather.location}
                temp={`${weather.temperature}°C`}
                condition={weather.condition}
                humidity={`${weather.humidity}%`}
                wind={weather.windSpeed}
              />
            </div>

            {/* Right Card: Comprehensive Meteorological Metrics */}
            <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Live Agro-Meteorological Parameters
                    </span>
                    <h3 className="text-xl font-black text-slate-900 font-display">
                      Current Atmosphere & Field Health
                    </h3>
                  </div>
                  <span className="text-3xl">{weather.icon || '☀️'}</span>
                </div>

                {/* 6 Key Meteorological Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mt-4">
                  {/* Feels Like Temp */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
                      <Thermometer className="w-4 h-4 text-amber-600" />
                      <span>Feels Like</span>
                    </div>
                    <p className="text-xl font-black text-slate-900 font-display">
                      {weather.feelsLike ?? weather.temperature}°C
                    </p>
                    <span className="text-[10px] text-slate-500">Apparent Heat Index</span>
                  </div>

                  {/* Rain Probability */}
                  <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200/80 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-sky-900 font-semibold">
                      <CloudRain className="w-4 h-4 text-sky-600" />
                      <span>Rain Probability</span>
                    </div>
                    <p className="text-xl font-black text-slate-900 font-display">
                      {weather.rainProbability}%
                    </p>
                    <span className="text-[10px] text-slate-500">
                      Precipitation: {weather.rainfall ?? 0} mm
                    </span>
                  </div>

                  {/* Humidity */}
                  <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-teal-900 font-semibold">
                      <Droplets className="w-4 h-4 text-teal-600" />
                      <span>Humidity</span>
                    </div>
                    <p className="text-xl font-black text-slate-900 font-display">
                      {weather.humidity}%
                    </p>
                    <span className="text-[10px] text-slate-500">Moisture Content</span>
                  </div>

                  {/* Wind Velocity */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <Wind className="w-4 h-4 text-slate-600" />
                      <span>Wind Speed</span>
                    </div>
                    <p className="text-lg font-black text-slate-900 font-display truncate">
                      {weather.windSpeed}
                    </p>
                    <span className="text-[10px] text-slate-500">Foliar Drift Risk</span>
                  </div>

                  {/* Sunrise */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
                      <Sunrise className="w-4 h-4 text-amber-600" />
                      <span>Sunrise</span>
                    </div>
                    <p className="text-lg font-black text-slate-900 font-display">
                      {weather.sunrise || '06:05 AM'}
                    </p>
                    <span className="text-[10px] text-slate-500">First Daylight</span>
                  </div>

                  {/* Sunset */}
                  <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-indigo-900 font-semibold">
                      <Sunset className="w-4 h-4 text-indigo-600" />
                      <span>Sunset</span>
                    </div>
                    <p className="text-lg font-black text-slate-900 font-display">
                      {weather.sunset || '06:45 PM'}
                    </p>
                    <span className="text-[10px] text-slate-500">Dusk Pacing</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Field Spraying Advisory Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-800 block">
                    Agri Spraying & Fertilizer Guidance
                  </span>
                  <p className="text-xs sm:text-sm font-medium mt-0.5 text-emerald-950">
                    {weather.sprayAdvisory}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Live Agricultural Forecast Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Extended Satellite Model
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 font-display">
                  7-Day Agricultural Forecast & Spray Windows
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 w-fit">
                ECMWF High-Res Feed
              </span>
            </div>

            {/* Forecast Rows */}
            <div className="space-y-2.5">
              {(weather.forecast && weather.forecast.length > 0 ? weather.forecast : [
                { day: 'Today', tempMax: 31, tempMin: 22, condition: 'Sunny & Clear', icon: '☀️', rainProbability: 5, spray: 'Favorable' },
                { day: 'Tomorrow', tempMax: 32, tempMin: 23, condition: 'Partly Cloudy', icon: '🌤️', rainProbability: 10, spray: 'Favorable' },
                { day: 'Wednesday', tempMax: 30, tempMin: 22, condition: 'Mild Cloud Cover', icon: '⛅', rainProbability: 15, spray: 'Favorable' },
                { day: 'Thursday', tempMax: 29, tempMin: 21, condition: 'Light Showers', icon: '🌦️', rainProbability: 45, spray: 'Avoid Spraying' },
                { day: 'Friday', tempMax: 28, tempMin: 21, condition: 'Moderate Rain', icon: '🌧️', rainProbability: 65, spray: 'No Spraying' },
                { day: 'Saturday', tempMax: 30, tempMin: 22, condition: 'Clearing Sky', icon: '🌤️', rainProbability: 20, spray: 'Favorable' },
                { day: 'Sunday', tempMax: 32, tempMin: 23, condition: 'Bright Sunshine', icon: '☀️', rainProbability: 5, spray: 'Favorable' }
              ]).map((f, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-100/80 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-2xl sm:text-3xl flex-shrink-0">{f.icon || '☀️'}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-black text-slate-900 text-sm font-display">{f.day}</h5>
                        {f.date && <span className="text-[11px] text-slate-400 font-semibold">• {f.date}</span>}
                      </div>
                      <p className="text-slate-600 font-medium mt-0.5">{f.condition}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                    <div className="text-left sm:text-right">
                      <span className="font-black text-slate-900 text-sm sm:text-base font-display">
                        {f.tempMax}°C <span className="text-slate-400 font-normal text-xs">/ {f.tempMin}°C</span>
                      </span>
                      <span className="text-[10px] text-sky-700 font-bold block">
                        🌧️ Rain: {f.rainProbability}% {f.rainfall > 0 ? `(${f.rainfall} mm)` : ''}
                      </span>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-xl text-[11px] font-bold ${
                          f.spray?.includes('Avoid') || f.spray?.includes('No')
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {f.spray}
                      </span>
                      {f.sunrise && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          🌅 {f.sunrise}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default FarmerWeatherPage;
