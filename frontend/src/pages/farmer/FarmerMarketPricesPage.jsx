import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Building2,
  MapPin,
  Calendar,
  Clock,
  RefreshCw,
  Search,
  Filter,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertCircle,
  Wheat,
  Layers,
  Sparkles,
  ArrowUpDown,
  Tag,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { marketService } from '../../services/marketService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useVoice } from '../../hooks/useVoice';
import { useLanguage } from '../../hooks/useLanguage';
import Button from '../../components/common/Button';
import { formatCurrency } from '../../utils/formatters';

const FarmerMarketPricesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { speak, stop, isSpeaking } = useVoice();
  const { language } = useLanguage();

  // Filters State
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedState, setSelectedState] = useState(user?.state || 'All');
  const [selectedDistrict, setSelectedDistrict] = useState(user?.district || 'All');
  const [selectedMarket, setSelectedMarket] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Options State
  const [filterOptions, setFilterOptions] = useState({
    crops: ['All'],
    states: ['All'],
    districts: ['All'],
    markets: ['All'],
    categories: ['All']
  });

  // Data State
  const [mandiData, setMandiData] = useState({
    total: 0,
    source: 'AGMARKNET • Directorate of Marketing & Inspection (Govt of India)',
    lastUpdatedFormatted: '',
    prices: []
  });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Load Filter Options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const opts = await marketService.getFilterOptions();
        if (opts) setFilterOptions(opts);
      } catch (err) {
        console.warn('Failed to load filter options:', err);
      }
    };
    fetchOptions();
  }, []);

  // Fetch Mandi Prices
  const loadPrices = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const filters = {};
      if (selectedCrop !== 'All') filters.crop = selectedCrop;
      if (selectedState !== 'All') filters.state = selectedState;
      if (selectedDistrict !== 'All') filters.district = selectedDistrict;
      if (selectedMarket !== 'All') filters.market = selectedMarket;
      if (searchQuery.trim()) filters.search = searchQuery.trim();

      const result = await marketService.getMandiPrices(filters);
      setMandiData(result);
      if (isManual) {
        toast.success('Live AGMARKNET Mandi rates refreshed with latest official records!');
      }
    } catch (err) {
      console.error('Failed to fetch mandi prices:', err);
      setError('Unable to retrieve official mandi prices from agricultural servers. Please retry.');
      if (isManual) toast.error('Failed to refresh market prices.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedCrop, selectedState, selectedDistrict, selectedMarket, searchQuery, toast]);

  // Load on filter change
  useEffect(() => {
    loadPrices();
  }, [selectedCrop, selectedState, selectedDistrict, selectedMarket]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadPrices();
  };

  const handleResetFilters = () => {
    setSelectedCrop('All');
    setSelectedState('All');
    setSelectedDistrict('All');
    setSelectedMarket('All');
    setSearchQuery('');
  };

  const handleReadPriceAloud = (p) => {
    if (isSpeaking) {
      stop();
      return;
    }
    const text =
      language === 'ta'
        ? `${p.market} சந்தையில் ${p.commodity} மாதிரியளவு விலை குவிண்டாலுக்கு ₹${p.modalPrice} மற்றும் ஒரு கிலோ ₹${p.pricePerKg}. தேதி: ${p.arrivalDate}.`
        : language === 'te'
        ? `${p.market} మార్కెట్‌లో ${p.commodity} సగటు ధర క్వింటాలుకు ₹${p.modalPrice} మరియు కిలో ₹${p.pricePerKg}. తేదీ: ${p.arrivalDate}.`
        : language === 'hi'
        ? `${p.market} में ${p.commodity} का मॉडल भाव ₹${p.modalPrice} प्रति क्विंटल यानी ₹${p.pricePerKg} प्रति किलो है। तारीख: ${p.arrivalDate}.`
        : `At ${p.market}, the modal rate for ${p.commodity} is ₹${p.modalPrice} per Quintal, which is ₹${p.pricePerKg} per kilogram. Date: ${p.arrivalDate}.`;

    speak(text, language);
  };

  return (
    <div className="space-y-6 select-none max-w-6xl mx-auto pb-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
              🏛️ Official AGMARKNET Mandi Feed
            </span>
            {mandiData.lastUpdatedFormatted && (
              <span className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" /> Updated {mandiData.lastUpdatedFormatted}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-display mt-2 text-white">
            Daily Agricultural Market Prices
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/80 mt-1">
            Real-time wholesale APMC Mandi rates from the Directorate of Marketing & Inspection, Ministry of Agriculture.
          </p>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3 relative z-10">
          <button
            type="button"
            onClick={() => loadPrices(true)}
            disabled={loading || isRefreshing}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/40 cursor-pointer transition-all active:scale-95 disabled:opacity-60"
            title="Refresh Official Market Rates"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing || loading ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Fetching APMC Feed...' : 'Refresh Prices'}</span>
          </button>
        </div>
      </div>

      {/* Filter Control Card */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700">
            <Filter className="w-4 h-4 text-emerald-600" />
            <span>Filter by Crop, State, District & Market</span>
          </div>

          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs font-bold text-slate-400 hover:text-emerald-700 underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>

        {/* 4 Cascading Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Crop Selector */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 block pl-1">
              Select Crop / Commodity
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              {filterOptions.crops.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* State Selector */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 block pl-1">
              Select State
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              {filterOptions.states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* District Selector */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 block pl-1">
              Select District
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              {filterOptions.districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Market Mandi Selector */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 block pl-1">
              Select Mandi / Market
            </label>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              {filterOptions.markets.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 pt-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by commodity, variety or market name (e.g. Tomato, Ponni Paddy, Koyambedu)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600"
            />
          </div>
          <Button type="submit" variant="primary" size="sm" className="px-5">
            Search
          </Button>
        </form>
      </div>

      {/* Error Alert */}
      {error && !loading && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => loadPrices(true)}
            className="font-bold underline hover:text-rose-950 cursor-pointer text-xs"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-slate-200 rounded-3xl"></div>
          ))}
        </div>
      ) : mandiData.prices.length === 0 ? (
        /* Empty State */
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-sm">
          <Wheat className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 font-display">
            No Official Market Data Found for Selected Filters
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            AGRIMIND strictly adheres to authorized AGMARKNET daily bulletins and does not invent or estimate missing crop prices. Try choosing "All" in the filters above.
          </p>
          <Button variant="outline" size="sm" onClick={handleResetFilters}>
            Clear Filters
          </Button>
        </div>
      ) : (
        /* Market Prices Grid */
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1 text-xs text-slate-500 font-semibold">
            <span>Showing {mandiData.prices.length} Official Mandi Price Records</span>
            <span className="text-[11px] bg-slate-100 px-2.5 py-1 rounded-full text-slate-600 font-bold">
              {mandiData.source}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mandiData.prices.map((p, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -3 }}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top Badges: Category & Actual Arrival Date */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {p.category}
                    </span>

                    {/* Actual Arrival Date / Status Badge */}
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        p.isToday
                          ? 'bg-emerald-100 text-emerald-800 font-extrabold'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      <Calendar className="w-3 h-3" />
                      {p.isToday ? "Today's Rate" : `Latest data: ${p.arrivalDate}`}
                    </span>
                  </div>

                  {/* Commodity Name & Variety */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 font-display">
                        {p.commodity}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Variety: {p.variety || 'Standard Local'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleReadPriceAloud(p)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 transition-colors cursor-pointer flex-shrink-0"
                      title="Listen aloud in your language"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Market & Location */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mt-2 bg-slate-50 p-2 rounded-xl">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{p.market}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 pl-2 mt-0.5">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span>{p.district}, {p.state}</span>
                  </div>

                  {/* Modal / Average Price Hero */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Modal Price (Avg)
                      </span>
                      <span className="text-2xl font-black text-slate-900 font-display">
                        {formatCurrency(p.modalPrice)}
                      </span>
                      <span className="text-xs font-bold text-slate-500"> / Quintal</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                        Price Per KG
                      </span>
                      <span className="text-lg font-black text-emerald-700 font-display">
                        ₹{p.pricePerKg}
                      </span>
                      <span className="text-xs font-semibold text-slate-500"> / kg</span>
                    </div>
                  </div>

                  {/* Min / Max Price Bar */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-100 text-xs">
                    <div className="p-2 rounded-xl bg-slate-50 text-slate-700">
                      <span className="text-[10px] font-bold text-slate-400 block">Min Price</span>
                      <span className="font-bold text-slate-900">{formatCurrency(p.minPrice)}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 text-slate-700">
                      <span className="text-[10px] font-bold text-slate-400 block">Max Price</span>
                      <span className="font-bold text-slate-900">{formatCurrency(p.maxPrice)}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Source & Trend */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1 font-semibold text-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Official APMC Data
                  </span>

                  {p.change && (
                    <span
                      className={`font-bold flex items-center gap-0.5 ${
                        p.trend === 'up'
                          ? 'text-emerald-700'
                          : p.trend === 'down'
                          ? 'text-rose-600'
                          : 'text-slate-500'
                      }`}
                    >
                      {p.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {p.change}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerMarketPricesPage;
