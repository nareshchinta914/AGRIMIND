import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sprout,
  Droplets,
  CloudSun,
  Calculator,
  BarChart3,
  CalendarDays,
  Bot,
  Store,
  Camera,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Mic
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useVoice } from '../../hooks/useVoice';
import { farmService } from '../../services/farmService';
import StatCard from '../../components/dashboard/StatCard';
import WeatherCard from '../../components/dashboard/WeatherCard';
import CropCard from '../../components/dashboard/CropCard';
import ActivityCard from '../../components/dashboard/ActivityCard';
import SoilScannerModal from '../../components/soil/SoilScannerModal';
import Button from '../../components/common/Button';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const { openAssistant, openCamera } = useVoice();
  const [isSoilModalOpen, setIsSoilModalOpen] = useState(false);
  const navigate = useNavigate();

  const [activities, setActivities] = useState([
    {
      id: 'act_1',
      title: 'Morning Drip Irrigation Cycle',
      time: '06:00 AM - 08:30 AM',
      date: 'Today',
      status: 'Completed',
      category: 'Water',
      plot: 'North Plot A (Ponni Paddy)',
      details: 'Applied 1.5 inches of water with root-zone drip drippers.'
    },
    {
      id: 'act_2',
      title: '2nd Top-Dressing Fertilizer Application',
      time: '04:30 PM',
      date: 'Today',
      status: 'Scheduled',
      category: 'Fertilizer',
      plot: 'South Plot B (Wheat)',
      details: 'Apply Urea (25kg/acre) + Micronutrient Zinc Sulfate (5kg/acre).'
    },
    {
      id: 'act_3',
      title: 'Field Weed Inspection & Soil Scuffling',
      time: '07:00 AM',
      date: 'Tomorrow',
      status: 'Pending',
      category: 'Field Care',
      plot: 'East Plot C (Vegetables)',
      details: 'Remove broadleaf weeds and inspect leaf undersides for aphid colonies.'
    }
  ]);

  useEffect(() => {
    let isMounted = true;
    const fetchActivities = async () => {
      try {
        const data = await farmService.getFarmActivities();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setActivities(data);
        }
      } catch (err) {
        // Safe fallback in state
      }
    };
    fetchActivities();
    return () => { isMounted = false; };
  }, []);

  // Real authenticated farmer name
  const farmerName = user?.fullName || user?.name || 'Farmer';

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // 8 Specified Farmer Quick Action Cards
  const farmerQuickActions = [
    {
      id: 'crops',
      title: '🌱 Crop Recommendation',
      desc: 'Find the right crop for your farm',
      path: '/farmer/crops',
      color: 'bg-emerald-50 text-emerald-950 border-emerald-200 hover:border-emerald-400',
      actionText: 'Find Crops',
      onClick: () => navigate('/farmer/crops')
    },
    {
      id: 'water',
      title: '💧 Water Advice',
      desc: 'Know when your crop needs water',
      path: '/farmer/water',
      color: 'bg-sky-50 text-sky-950 border-sky-200 hover:border-sky-400',
      actionText: 'Water Schedule',
      onClick: () => navigate('/farmer/water')
    },
    {
      id: 'weather',
      title: '🌦️ Weather',
      desc: "Check today's weather",
      path: '/farmer/weather',
      color: 'bg-amber-50 text-amber-950 border-amber-200 hover:border-amber-400',
      actionText: 'Weather Radar',
      onClick: () => navigate('/farmer/weather')
    },
    {
      id: 'cost',
      title: '💰 Farm Cost',
      desc: 'Track your farming expenses',
      path: '/farmer/cost',
      color: 'bg-purple-50 text-purple-950 border-purple-200 hover:border-purple-400',
      actionText: 'Calculate ROI',
      onClick: () => navigate('/farmer/cost')
    },
    {
      id: 'reports',
      title: '📊 Farm Reports',
      desc: 'View your farm performance',
      path: '/farmer/reports',
      color: 'bg-teal-50 text-teal-950 border-teal-200 hover:border-teal-400',
      actionText: 'View Reports',
      onClick: () => navigate('/farmer/reports')
    },
    {
      id: 'camera_problem',
      title: '📷 Identify Crop Problem',
      desc: 'Take a photo and ask AGRIMIND',
      path: '#',
      color: 'bg-rose-50 text-rose-950 border-rose-200 hover:border-rose-400',
      actionText: 'Scan Leaf Photo',
      onClick: () => openCamera()
    },
    {
      id: 'voice_assistant',
      title: '🎙️ Ask AGRIMIND',
      desc: 'Speak your farming question',
      path: '#',
      color: 'bg-yellow-50 text-yellow-950 border-yellow-300 ring-2 ring-yellow-400/40 hover:border-yellow-500',
      actionText: 'Speak Question',
      onClick: () => openAssistant()
    },
    {
      id: 'marketplace',
      title: '🛒 Sell Your Crop',
      desc: 'Connect with buyers',
      path: '/farmer/marketplace',
      color: 'bg-lime-50 text-lime-950 border-lime-200 hover:border-lime-400',
      actionText: 'Sell Harvest',
      onClick: () => navigate('/farmer/marketplace')
    }
  ];

  return (
    <div className="space-y-8 select-none">
      {/* ========================================================================= */}
      {/* 7. FARMER DASHBOARD HEADER                                               */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black text-3xl shadow-lg flex-shrink-0">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-slate-950 px-2.5 py-0.5 rounded-full">
                Farmer Dashboard
              </span>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> PM-KISAN Verified
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-white mt-1">
              {getGreeting()}, {farmerName} 👋
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Here is your farm information for today.
            </p>
            <p className="text-[11px] text-emerald-300/90 flex items-center gap-2 mt-1">
              <span>📍 {user?.village ? `${user.village}, ` : ''}{user?.district || 'Thanjavur'}, {user?.state || 'Tamil Nadu'}</span>
              <span>•</span>
              <span>🌱 Soil: {user?.soilType ? String(user.soilType).toUpperCase() : 'ALLUVIAL LOAM'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            icon={Camera}
            onClick={() => setIsSoilModalOpen(true)}
            className="shadow-lg shadow-emerald-600/30"
          >
            Scan Soil
          </Button>
          <Link to="/farmer/marketplace">
            <Button variant="amber" size="md" icon={Store}>
              Sell Harvest
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Cultivated Land"
          value={user?.farmSize || '5.0'}
          unit={user?.farmSizeUnit || 'Acres'}
          subtitle="100% Active Sowing"
          icon={Sprout}
          color="emerald"
        />
        <StatCard
          title="Standing Crop"
          value={user?.currentCrop || 'Paddy (Ponni)'}
          subtitle="Harvest in ~32 Days"
          icon={Sprout}
          color="emerald"
        />
        <StatCard
          title="Expected Yield"
          value="140"
          unit="Quintals"
          subtitle="Est. Value: ₹3,57,000"
          icon={TrendingUp}
          color="amber"
        />
        <StatCard
          title="Crop Health"
          value="98%"
          subtitle="Optimal Condition"
          icon={ShieldCheck}
          color="sky"
        />
      </div>

      {/* ========================================================================= */}
      {/* 8 FARMER QUICK ACTION CARDS                                               */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 font-display">
            Farmer Quick Actions
          </h3>
          <span className="text-xs text-slate-500 font-bold">Tap any card to open</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {farmerQuickActions.map((card) => (
            <motion.button
              key={card.id}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={card.onClick}
              className={`p-5 rounded-3xl border-2 shadow-sm flex flex-col justify-between gap-4 transition-all text-left cursor-pointer ${card.color}`}
            >
              <div className="space-y-1">
                <h4 className="text-base font-black font-display text-slate-900 leading-tight">
                  {card.title}
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="w-full py-2.5 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-between shadow-md transition-all">
                <span>{card.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Side-by-side Weather & Standing Crop details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WeatherCard location={`${user?.district || 'Thanjavur'}, ${user?.state || 'Tamil Nadu'}`} />
        <CropCard
          cropName={user?.currentCrop || 'Ponni Samba Paddy'}
          variety="BPT 5204 / CR 1009 Sub 1"
          stage="Tillering to Booting Stage (Day 45)"
          expectedYield="26 Quintals/Acre"
          healthScore={98}
          nextAction="Top-dressing with Urea (25kg) + Zinc Sulfate (5kg/Acre) tomorrow morning."
        />
      </div>

      {/* Farm Activities Timeline */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-emerald-600" />
            <span>Today's Farm Activities & Task Planner</span>
          </h3>
          <Link to="/farmer/activities" className="text-xs font-bold text-emerald-700 hover:underline">
            View All Tasks →
          </Link>
        </div>

        <div className="space-y-3">
          {activities.slice(0, 3).map((act) => (
            <ActivityCard key={act.id} activity={act} />
          ))}
        </div>
      </div>

      {/* Soil Scanner Modal */}
      <SoilScannerModal isOpen={isSoilModalOpen} onClose={() => setIsSoilModalOpen(false)} />
    </div>
  );
};

export default FarmerDashboard;
