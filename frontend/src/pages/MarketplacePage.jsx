import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Building2,
  Phone,
  MessageCircle,
  MapPin,
  ShieldCheck,
  Star,
  Search,
  Plus,
  Volume2,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  Salad,
  Wheat,
  Flame,
  Shirt,
  Store,
  Info
} from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { marketService } from '../services/marketService';
import { useToast } from '../hooks/useToast';
import { useVoice } from '../hooks/useVoice';
import { useLanguage } from '../hooks/useLanguage';
import { formatCurrency } from '../utils/formatters';

const COMMODITY_CATEGORIES = [
  { id: 'All', label: 'All Mandis', icon: Layers },
  { id: 'Vegetables', label: '🥦 Vegetables', icon: Salad },
  { id: 'Cereals & Grains', label: '🌾 Grains & Paddy', icon: Wheat },
  { id: 'Spices & Condiments', label: '🌶️ Spices & Herbs', icon: Flame },
  { id: 'Cash Crops & Fiber', label: '🧵 Cash Crops', icon: Shirt },
];

const MarketplacePage = () => {
  const [activeTab, setActiveTab] = useState('mandi'); // 'mandi', 'merchants', 'listings'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mandiPrices, setMandiPrices] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');

  // Farmer Sell Crop Modal
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [sellForm, setSellForm] = useState({
    cropName: 'Tomato',
    variety: 'Hybrid Red (Grade-A)',
    quantity: '20',
    unit: 'Crates (25kg)',
    expectedPrice: '650',
    location: 'Oddanchatram / Dindigul, Tamil Nadu',
    phone: '',
  });

  const { toast } = useToast();
  const { speak } = useVoice();
  const { language, t } = useLanguage();

  const loadData = async () => {
    setLoading(true);
    try {
      const [mandiRes, merchantRes, listRes] = await Promise.all([
        marketService.getMandiPrices(),
        marketService.getBuyingMerchants(),
        marketService.getMarketListings(),
      ]);
      setMandiPrices(mandiRes.prices || []);
      setMerchants(merchantRes.merchants || []);
      setListings(listRes.listings || []);
    } catch (err) {
      toast.error('Failed to load live market data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSellSubmit = async (e) => {
    e.preventDefault();
    if (!sellForm.cropName || !sellForm.quantity || !sellForm.phone) {
      toast.warning('Please fill in produce name, quantity, and phone number');
      return;
    }

    try {
      const res = await marketService.postFarmerProduce(sellForm);
      toast.success(res.message || 'Harvest offer broadcast to verified merchants!');
      setIsSellModalOpen(false);
      setSellForm({
        cropName: 'Tomato',
        variety: 'Hybrid Red',
        quantity: '20',
        unit: 'Crates',
        expectedPrice: '650',
        location: '',
        phone: '',
      });
    } catch (err) {
      toast.error('Failed to post crop offer');
    }
  };

  const handleListenPrice = (item) => {
    const modalPrice = item.modalPrice || item.price || 0;
    const perKg = (modalPrice / 100).toFixed(1);
    
    let speechText = '';
    if (language === 'ta') {
      speechText = `${item.commodity} சந்தை விலை குவிண்டால் ரூ.${modalPrice}. ஒரு கிலோ ரூ.${perKg}.`;
    } else if (language === 'hi') {
      speechText = `${item.commodity} मंडी भाव रु.${modalPrice} प्रति क्विंटल, यानी रु.${perKg} प्रति किलो।`;
    } else if (language === 'te') {
      speechText = `${item.commodity} మార్కెట్ ధర క్వింటాల్‌కు రూ.${modalPrice}. కిలో రూ.${perKg}.`;
    } else {
      speechText = `${item.commodity} price at ${item.market || 'Mandi'} is ${modalPrice} rupees per quintal, which is ${perKg} rupees per kilogram.`;
    }

    speak(speechText, language);
  };

  // Filter Mandi Prices by Category, Search, and State
  const filteredMandiPrices = mandiPrices.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      item.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      (item.commodity && item.commodity.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.variety && item.variety.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.market && item.market.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesState = selectedState === 'All' || item.state === selectedState;
    return matchesCategory && matchesSearch && matchesState;
  });

  // Filter Merchants by Category and Search
  const filteredMerchants = merchants.filter((m) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      m.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      (m.companyName && m.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.buyingCommodity && m.buyingCommodity.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.location && m.location.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Vegetable stats
  const vegCount = mandiPrices.filter((p) => p.category === 'Vegetables').length;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8 select-none">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Glow Decor */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2.5 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-400/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Live APMC Vegetables & Mandi Network</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-white">
            {t('mandiMarketTitle') || 'Live Mandi Market & Produce Rates'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 font-medium max-w-2xl">
            Real-time daily mandi rates for <span className="text-amber-300 font-bold">18+ fresh vegetables</span>, grains, and cash crops across APMCs with direct access to verified buyers and millers.
          </p>
        </div>

        {/* Action Button */}
        <Button
          variant="amber"
          size="xl"
          icon={Plus}
          onClick={() => setIsSellModalOpen(true)}
          className="shadow-2xl shadow-amber-500/40 font-black text-base flex-shrink-0 z-10 cursor-pointer"
        >
          {t('sellCrop') || '+ Sell Farm Produce'}
        </Button>
      </div>

      {/* Main Tab Controls */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-3 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('mandi')}
          className={`px-5 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'mandi'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Live Mandi Rates ({filteredMandiPrices.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('merchants')}
          className={`px-5 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'merchants'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Buying Merchants & Supermarkets ({merchants.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('listings')}
          className={`px-5 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'listings'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Farmer Seeds & Tools ({listings.length})</span>
        </button>
      </div>

      {/* Category Pills Selector */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {COMMODITY_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-md ring-2 ring-slate-900'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{cat.label}</span>
              {cat.id === 'Vegetables' && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-white font-black">
                  {vegCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search & State Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-80">
          <Input
            placeholder="Search produce (e.g. Tomato, Rice, Chilli)..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="!py-2 text-sm"
          />
        </div>

        {activeTab === 'mandi' && (
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">State:</span>
            {['All', 'Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Maharashtra', 'Kerala', 'Uttar Pradesh', 'Gujarat', 'Punjab', 'Haryana'].map(
              (st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedState(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                    selectedState === st
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* TAB 1: LIVE MANDI PRICES */}
      {activeTab === 'mandi' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900 font-display flex items-center gap-2">
                <span>{t('todayMandiRates') || "Today's Live Mandi & Produce Rates"}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                  {filteredMandiPrices.length} Items Live
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Official APMC daily modal benchmark prices with arrivals and trends.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={loadData}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                <span>Refresh Rates</span>
              </button>
            </div>
          </div>

          {filteredMandiPrices.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <span className="text-4xl">🥦</span>
              <h3 className="text-lg font-black text-slate-900">No commodities matched your filter</h3>
              <p className="text-xs text-slate-500">Try clearing your search query or selecting "All Mandis".</p>
              <Button variant="outline" size="sm" onClick={() => { setSelectedCategory('All'); setSelectedState('All'); setSearchQuery(''); }}>
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredMandiPrices.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-3xl p-5 border-2 border-slate-200/80 shadow-md hover:shadow-xl hover:border-emerald-500/50 transition-all flex flex-col justify-between gap-4 relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          {item.category || 'Produce'}
                        </span>
                        <h3 className="text-base font-black text-slate-900 font-display mt-1">
                          {item.commodity}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">{item.variety}</p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-lg border ${
                          item.priceTrend?.includes('+') || item.priceTrend?.includes('▲')
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {item.priceTrend?.includes('+') ? (
                          <TrendingUp className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-rose-600" />
                        )}
                        <span>{item.priceTrend || 'Stable'}</span>
                      </span>
                    </div>

                    {/* Price Block */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-baseline justify-between">
                      <div>
                        <span className="text-xl font-black text-slate-900">
                          ₹{Number(item.modalPrice || item.price || 0).toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-500 font-medium"> / Quintal</span>
                      </div>
                      <span className="text-xs font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-lg">
                        ₹{(Number(item.pricePerKg || (item.modalPrice || item.price || 0) / 100)).toFixed(1)} / kg
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <p className="flex items-center gap-1.5 font-bold">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{item.market}, {item.state}</span>
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center justify-between pt-0.5">
                        <span>Range: ₹{item.minPrice || item.modalPrice} - ₹{item.maxPrice || item.modalPrice}</span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                          {item.isToday ? "Today's Data" : `Data: ${item.arrivalDate || 'Recent'}`}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleListenPrice(item)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t('listenPrice') || 'Listen Price'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSellForm((prev) => ({
                          ...prev,
                          cropName: item.commodity,
                          variety: item.variety,
                          expectedPrice: String(item.modalPrice || 1000)
                        }));
                        setIsSellModalOpen(true);
                      }}
                      className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      {t('sellCrop') || 'Sell'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BUYING MERCHANTS */}
      {activeTab === 'merchants' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 font-display">
                Verified Supermarket Buyers & Agricultural Millers
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct buyers offering transparent spot payments at APMC benchmark rates.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMerchants.map((m) => (
              <motion.div
                key={m.id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl p-6 border-2 border-slate-200/80 shadow-md hover:shadow-xl hover:border-emerald-500/50 transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xl shadow-inner">
                        🏢
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900">{m.companyName}</h4>
                        <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> GST & APMC Licensed
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="text-slate-600">
                      <strong>Buying:</strong> {m.buyingCommodity}
                    </p>
                    <p className="text-slate-600">
                      <strong>Min Quantity:</strong> {m.minQuantity}
                    </p>
                    <p className="text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{m.location}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <a
                    href={`tel:${m.phone || '9842109876'}`}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all text-center"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Buyer</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FARMER SEEDS & TOOLS */}
      {activeTab === 'listings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 font-display">
                Certified Seeds, Bio-Fertilizers & Farm Equipment
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                High-germination seed varieties and agricultural tools directly available.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {listings.map((l) => (
              <motion.div
                key={l.id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl p-5 border-2 border-slate-200/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between gap-3"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-bold bg-sky-50 text-sky-800 px-2 py-0.5 rounded-md border border-sky-100">
                    {l.category || 'Farm Input'}
                  </span>
                  <h4 className="text-sm font-black text-slate-900">{l.title}</h4>
                  <p className="text-xs text-slate-500">{l.description}</p>
                  <p className="text-base font-black text-emerald-700">₹{l.price}</p>
                </div>

                <Button variant="primary" size="sm" className="w-full">
                  View Details
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Sell Crop Modal */}
      <Modal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        title="🌾 Broadcast Farm Harvest Offer"
        subtitle="Connect with 1,500+ verified grain millers and supermarket buyers"
      >
        <form onSubmit={handleSellSubmit} className="space-y-4 pt-2">
          <Input
            label="Produce / Crop Name"
            value={sellForm.cropName}
            onChange={(e) => setSellForm({ ...sellForm, cropName: e.target.value })}
            placeholder="e.g. Tomato, Ponni Paddy, Red Chilli"
            required
          />

          <Input
            label="Variety / Grade"
            value={sellForm.variety}
            onChange={(e) => setSellForm({ ...sellForm, variety: e.target.value })}
            placeholder="e.g. Hybrid Grade-A, BPT-5204"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Quantity Available"
              value={sellForm.quantity}
              onChange={(e) => setSellForm({ ...sellForm, quantity: e.target.value })}
              type="number"
              placeholder="e.g. 50"
              required
            />
            <Input
              label="Unit (Bags/Quintals/Crates)"
              value={sellForm.unit}
              onChange={(e) => setSellForm({ ...sellForm, unit: e.target.value })}
              placeholder="Quintals / Bags"
              required
            />
          </div>

          <Input
            label="Expected Price (₹)"
            value={sellForm.expectedPrice}
            onChange={(e) => setSellForm({ ...sellForm, expectedPrice: e.target.value })}
            placeholder="e.g. 2450 / Quintal"
            required
          />

          <Input
            label="Farm Location / Mandi Yard"
            value={sellForm.location}
            onChange={(e) => setSellForm({ ...sellForm, location: e.target.value })}
            placeholder="e.g. Thanjavur Mandi, Tamil Nadu"
            required
          />

          <Input
            label="Farmer Contact Mobile Number"
            value={sellForm.phone}
            onChange={(e) => setSellForm({ ...sellForm, phone: e.target.value })}
            type="tel"
            maxLength={10}
            placeholder="10-digit mobile number"
            required
          />

          <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsSellModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Broadcast Harvest Offer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MarketplacePage;
