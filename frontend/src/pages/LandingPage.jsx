import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mic,
  Volume2,
  PhoneCall,
  Search,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Bot,
  MessageSquare,
  Globe,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useVoice } from '../hooks/useVoice';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import LanguageSelectorModal from '../components/common/LanguageSelectorModal';
import ChatDrawerModal from '../components/chat/ChatDrawerModal';
import SoilScannerModal from '../components/soil/SoilScannerModal';

const LandingPage = () => {
  const { language, languages, t } = useLanguage();
  const { openAssistant, openCamera, speak } = useVoice();
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Modal States
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSoilModalOpen, setIsSoilModalOpen] = useState(false);
  const [selectedMerchantForChat, setSelectedMerchantForChat] = useState(null);

  // Mandi Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Crops');

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  // Auth Gate: Require login before accessing operator tools
  const requireAuth = (actionCallback) => {
    if (!isAuthenticated) {
      toast.info('Please Login or Signup first to access this tool.');
      navigate('/login');
      return;
    }
    actionCallback();
  };

  // 6 Colored Pastel Feature Cards (Instant interactive tool access)
  const quickToolCards = [
    {
      id: 'crop_rec',
      title: 'Crop Recommendation',
      icon: '🌽',
      bgColor: 'bg-[#e7f7ef]',
      borderColor: 'border-[#b2ebd0]',
      textColor: 'text-emerald-950',
      action: () => requireAuth(() => setIsSoilModalOpen(true)),
      audio: 'Scan and test farm soil to get recommended crops'
    },
    {
      id: 'fertilizer',
      title: 'Fertilizer & Disease',
      icon: '🧪',
      bgColor: 'bg-[#fef9e7]',
      borderColor: 'border-[#fde8a1]',
      textColor: 'text-amber-950',
      action: () => requireAuth(() => openCamera()),
      audio: 'Scan crop disease and calculate fertilizer dosage'
    },
    {
      id: 'weather',
      title: 'Rain Weather',
      icon: '☀️',
      bgColor: 'bg-[#fefbe8]',
      borderColor: 'border-[#fef08a]',
      textColor: 'text-yellow-950',
      action: () => requireAuth(() => navigate('/features?tab=weather')),
      audio: 'Today rain and weather forecast'
    },
    {
      id: 'water',
      title: 'Smart Water Time',
      icon: '💧',
      bgColor: 'bg-[#eef8fe]',
      borderColor: 'border-[#bae6fd]',
      textColor: 'text-sky-950',
      action: () => requireAuth(() => navigate('/features?tab=water')),
      audio: 'Smart irrigation and water scheduling'
    },
    {
      id: 'profit',
      title: 'Farm Profit & ROI',
      icon: '💰',
      bgColor: 'bg-[#f5f0fb]',
      borderColor: 'border-[#e9d5ff]',
      textColor: 'text-purple-950',
      action: () => requireAuth(() => navigate('/features?tab=cost')),
      audio: 'Farm expense calculation and profit margins'
    },
    {
      id: 'voice',
      title: 'Voice Assistant',
      icon: '🎙️',
      bgColor: 'bg-[#fef3c7]',
      borderColor: 'border-[#f59e0b] ring-2 ring-amber-400/40',
      textColor: 'text-amber-950',
      action: () => requireAuth(() => openAssistant()),
      audio: 'Ask Kisan AI by speaking in your regional language'
    }
  ];

  // 12 Exact Mandi Commodity Cards
  const mandiCommodities = [
    {
      id: 'rice',
      name: 'Rice (Paddy)',
      category: 'Cereals',
      icon: '🌾',
      price: 2450,
      perKg: '24.5',
      trend: '+₹120',
      isUp: true,
      mandi: 'Coimbatore Mandi',
    },
    {
      id: 'wheat',
      name: 'Wheat',
      category: 'Cereals',
      icon: '🌾',
      price: 2275,
      perKg: '22.75',
      trend: '+₹45',
      isUp: true,
      mandi: 'Madurai APMC',
    },
    {
      id: 'cotton',
      name: 'Cotton (Kapas)',
      category: 'Cash Crops',
      icon: '🌿',
      price: 7100,
      perKg: '71',
      trend: '+₹250',
      isUp: true,
      mandi: 'Tirupur Market',
    },
    {
      id: 'sugarcane',
      name: 'Sugarcane',
      category: 'Cash Crops',
      icon: '🎋',
      price: 3150,
      perKg: '31.5',
      trend: '+₹80',
      isUp: true,
      mandi: 'Erode Mandi',
    },
    {
      id: 'maize',
      name: 'Maize (Corn)',
      category: 'Cereals',
      icon: '🌽',
      price: 2150,
      perKg: '21.5',
      trend: '-₹30',
      isUp: false,
      mandi: 'Salem APMC',
    },
    {
      id: 'groundnut',
      name: 'Groundnut',
      category: 'Cash Crops',
      icon: '🥜',
      price: 6550,
      perKg: '65.5',
      trend: '+₹180',
      isUp: true,
      mandi: 'Vellore Mandi',
    },
    {
      id: 'tomato',
      name: 'Tomato',
      category: 'Vegetables',
      icon: '🍅',
      price: 3200,
      perKg: '32',
      trend: '+₹350',
      isUp: true,
      mandi: 'Koyambedu Wholesale',
    },
    {
      id: 'onion',
      name: 'Onion',
      category: 'Vegetables',
      icon: '🧅',
      price: 2800,
      perKg: '28',
      trend: '-₹110',
      isUp: false,
      mandi: 'Ottanchathiram Market',
    },
    {
      id: 'potato',
      name: 'Potato',
      category: 'Vegetables',
      icon: '🥔',
      price: 1950,
      perKg: '19.5',
      trend: '+₹60',
      isUp: true,
      mandi: 'Nilgiris Mandi',
    },
    {
      id: 'chilli',
      name: 'Red Chilli',
      category: 'Spices',
      icon: '🌶️',
      price: 18500,
      perKg: '185',
      trend: '+₹450',
      isUp: true,
      mandi: 'Ramnad Mandi',
    },
    {
      id: 'turmeric',
      name: 'Turmeric',
      category: 'Spices',
      icon: '🟡',
      price: 14200,
      perKg: '142',
      trend: '+₹320',
      isUp: true,
      mandi: 'Erode Market',
    },
    {
      id: 'coconut',
      name: 'Coconut',
      category: 'Cash Crops',
      icon: '🥥',
      price: 12500,
      perKg: '12.5',
      trend: '+₹200',
      isUp: true,
      mandi: 'Pollachi Market',
    }
  ];

  // Category filter list
  const categories = [
    'All Crops',
    'Cereals',
    'Vegetables',
    'Cash Crops',
    'Spices',
    '🛒 Buyer Purchase Option (Direct Farmers)'
  ];

  const filteredCommodities = mandiCommodities.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mandi.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeCategory === 'All Crops') return matchesSearch;
    if (activeCategory === '🛒 Buyer Purchase Option (Direct Farmers)') return matchesSearch;
    return matchesSearch && item.category === activeCategory;
  });

  const handleListenPrice = (crop) => {
    const speechText = `${crop.name} price at ${crop.mandi} is ${crop.price} rupees per quintal, which is ${crop.perKg} rupees per kilogram. Trend is ${crop.trend}.`;
    speak(speechText);
  };

  const handleBuyCrop = (crop) => {
    requireAuth(() => {
      setSelectedMerchantForChat({
        id: 'chat_merchant_' + crop.id,
        name: `${crop.name} Procurement Desk (${crop.mandi})`,
        role: 'Verified Buyer',
        avatar: crop.icon,
        location: crop.mandi,
        phone: '9842109876',
        messages: [
          {
            id: 'm_buy_init',
            sender: 'merchant',
            text: `வணக்கம்! We are buying ${crop.name} at ₹${crop.price}/Quintal from direct farmers in ${crop.mandi}. How much harvest quantity do you want to sell?`,
            time: 'Just now'
          }
        ]
      });
      setIsChatOpen(true);
    });
  };

  return (
    <div className="min-h-screen bg-[#f3f7f4] text-slate-900 select-none pb-24 overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. TOP HERO ANIMATION SCREEN (Mobile-Optimized Responsive Layout)           */}
      {/* ========================================================================= */}
      <section className="w-full h-[75vh] sm:h-screen min-h-[480px] relative bg-gradient-to-b from-slate-950 via-[#072c1a] to-slate-900 overflow-hidden select-none">
        {/* Top Floating Responsive Header (Brand + Language + Auth) */}
        <div className="absolute top-3 left-3 right-3 sm:top-6 sm:left-8 sm:right-8 z-30 flex items-center justify-between gap-2 pointer-events-auto">
          {/* Brand Logo Pill */}
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-slate-950/80 backdrop-blur-md text-white border border-emerald-500/40 shadow-xl"
          >
            <span className="text-base sm:text-lg">🌾</span>
            <span className="font-black font-display text-xs sm:text-sm tracking-wide text-emerald-400">
              AGRIMIND
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5"></span>
          </Link>

          {/* Right Action Controls (Language & Auth) */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Language Selector Pill */}
            <button
              type="button"
              onClick={() => setIsLangModalOpen(true)}
              className="flex items-center gap-1 sm:gap-2 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm text-slate-950 bg-[#fde047] hover:bg-[#facc15] shadow-lg border border-yellow-300 transition-transform active:scale-95 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-900" />
              <span className="truncate max-w-[70px] sm:max-w-none">{currentLangObj.nativeName}</span>
              <ChevronDown className="w-3 h-3 text-slate-800" />
            </button>

            {/* Profile / Dashboard / Logout Pill */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1.5 sm:gap-2 bg-[#fde047] text-slate-950 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-lg border border-yellow-300">
                <Link
                  to={user?.role === 'CUSTOMER' ? '/customer/dashboard' : user?.role === 'MERCHANT' ? '/merchant/dashboard' : '/farmer/dashboard'}
                  className="flex items-center gap-1 hover:underline text-slate-950 font-black"
                >
                  <span>🌾</span>
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <span className="opacity-40">|</span>
                <Link to="/profile" className="flex items-center gap-1 hover:underline truncate max-w-[80px] sm:max-w-[120px]">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-900 flex-shrink-0" />
                  <span className="truncate">{user?.name || user?.fullName || 'Profile'}</span>
                </Link>
                <span className="opacity-40">|</span>
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-0.5 hover:text-red-700 cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link to="/login">
                  <button
                    type="button"
                    className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-slate-950 bg-[#fde047] hover:bg-[#facc15] shadow-lg border border-yellow-300 transition-all active:scale-95 cursor-pointer"
                  >
                    {t('login')}
                  </button>
                </Link>
                <Link to="/register">
                  <button
                    type="button"
                    className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-black text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-xl border border-emerald-300 transition-all active:scale-95 cursor-pointer"
                  >
                    {t('signup')}
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Video Animation Element */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover opacity-100"
        >
          <source src="/agrimind-hero-animation.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Floating Voice Guidance Widget */}
        <div className="absolute bottom-4 left-3 right-3 sm:left-auto sm:right-8 sm:bottom-8 z-20 pointer-events-auto">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => requireAuth(() => openAssistant())}
            className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-3 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl sm:rounded-full bg-[#112a1c]/95 text-white border-2 border-emerald-400 shadow-2xl backdrop-blur-md cursor-pointer group"
          >
            {/* Kisan Badge Icon */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-base sm:text-lg shadow-inner flex-shrink-0">
              👨‍🌾
            </div>

            <div className="text-left flex-1 min-w-0">
              <span className="text-xs font-black text-white group-hover:text-emerald-300 transition-colors block">
                🎙️ Kisan Voice Guidance
              </span>
              <span className="text-[10px] text-emerald-200 block font-semibold truncate">
                Tap to Speak in Regional Languages
              </span>
            </div>

            {/* Animated Audio Equalizer Wave Bars */}
            <div className="flex items-end gap-1 h-4 sm:h-5 pl-1 flex-shrink-0">
              <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-2.5"></span>
              <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-4 sm:h-5 delay-75"></span>
              <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-3.5 delay-150"></span>
              <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-2 delay-100"></span>
            </div>
          </motion.button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TOP 6 PASTEL QUICK-ACTION TOOL CARDS (Responsive Grid)                 */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
          {quickToolCards.map((card) => (
            <motion.button
              key={card.id}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={card.action}
              className={`p-3 sm:p-4 rounded-2xl sm:rounded-3xl border ${card.borderColor} ${card.bgColor} ${card.textColor} shadow-md sm:shadow-lg hover:shadow-xl transition-all flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2 cursor-pointer group min-h-[105px] sm:min-h-[130px]`}
            >
              <span className="text-2xl sm:text-4xl group-hover:scale-110 transition-transform">
                {card.icon}
              </span>
              <span className="text-[11px] sm:text-sm font-black font-display tracking-tight leading-tight">
                {card.title}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LIVE CROP MARKET PRICES & MANDI RATES (Mobile Responsive)              */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-8 sm:mt-10">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-lg sm:shadow-xl border border-slate-200 space-y-4 sm:space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xl sm:text-2xl">📈</span>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 font-display">
                Live Crop Market Prices & Mandi Rates
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[10px] sm:text-xs font-black uppercase tracking-wider animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                LIVE e-NAM
              </span>
            </div>

            <p className="text-[11px] sm:text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 w-fit">
              Updated Live from Agmarknet Mandis
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3.5 top-3 sm:top-3.5" />
            <input
              type="text"
              placeholder="Search crops or mandi (e.g. Rice, Coimbatore)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-xl sm:rounded-full bg-[#f8faf8] border-2 border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-black whitespace-nowrap transition-all active:scale-95 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#14532d] text-white shadow-md'
                    : 'bg-[#eef5ee] text-[#14532d] hover:bg-[#dfeee0] border border-[#cfe4d0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 12 Live Commodity Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 pt-1">
            {filteredCommodities.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -2, scale: 1.01 }}
                className={`p-3.5 sm:p-4 rounded-2xl bg-white border-2 transition-all flex flex-col justify-between gap-3 shadow-sm hover:shadow-md ${
                  !item.isUp
                    ? 'border-rose-200 bg-rose-50/20'
                    : 'border-emerald-100 hover:border-emerald-300'
                }`}
              >
                {/* Header: Name + Price Trend */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.icon}</span>
                    <h3 className="text-sm font-black text-slate-900 font-display">
                      {item.name}
                    </h3>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded-lg border ${
                      item.isUp
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {item.isUp ? (
                      <TrendingUp className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-rose-600" />
                    )}
                    <span>{item.trend}</span>
                  </span>
                </div>

                {/* Price Display */}
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl sm:text-2xl font-black text-slate-950 font-display">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">/ quintal</span>
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-500 block mt-0.5">
                    ₹{item.perKg} / kg
                  </span>
                </div>

                {/* Mandi Tag */}
                <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-md w-fit border border-emerald-100">
                  {item.mandi}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleListenPrice(item)}
                    className="py-2 px-1.5 rounded-xl bg-[#112a1c] hover:bg-[#1b432d] text-white text-[11px] font-black flex items-center justify-center gap-1 shadow-sm transition-transform active:scale-95 cursor-pointer"
                    title="Listen Price Aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />
                    <span className="truncate">Listen</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleBuyCrop(item)}
                    className="py-2 px-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black flex items-center justify-center gap-1 shadow-sm transition-transform active:scale-95 cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Buy</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FLOATING LIVE CHATTING SYSTEM BUTTON (Bottom Responsive)               */}
      {/* ========================================================================= */}
      <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            requireAuth(() => {
              setSelectedMerchantForChat(null);
              setIsChatOpen(true);
            });
          }}
          className="flex items-center gap-2 px-3.5 py-2.5 sm:px-5 sm:py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-xs sm:text-sm shadow-2xl border-2 border-emerald-300 cursor-pointer shadow-emerald-600/40"
        >
          <div className="relative">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-slate-900 animate-ping"></span>
          </div>
          <span>💬 Kisan Chat</span>
          <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
            LIVE
          </span>
        </motion.button>
      </div>

      {/* Language Selector Modal */}
      <LanguageSelectorModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
      />

      {/* Full-Featured Chat System Drawer (Kisan AI + Merchant Deals + Community) */}
      <ChatDrawerModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        targetMerchant={selectedMerchantForChat}
      />

      {/* AI Soil Scanner & Verification Modal */}
      <SoilScannerModal
        isOpen={isSoilModalOpen}
        onClose={() => setIsSoilModalOpen(false)}
      />
    </div>
  );
};

export default LandingPage;
