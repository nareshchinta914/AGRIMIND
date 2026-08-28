import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Truck,
  ShieldCheck,
  MapPin,
  Clock,
  Heart,
  TrendingDown,
  ShoppingBag,
  ExternalLink,
  Phone
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';

const CustomerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8 select-none">
      {/* Customer Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg">
            🛒
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-sky-400 text-slate-950 px-3 py-0.5 rounded-full">
                🛒 Customer & Consumer Hub
              </span>
              <span className="text-xs text-sky-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Direct Farm Verified
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display mt-1">
              Welcome, {user?.name || 'Ananya Sharma'}
            </h1>
            <p className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
              <span>📍 {user?.deliveryAddress || 'Chennai, Tamil Nadu'}</span>
              <span>•</span>
              <span>📞 {user?.phone || '9876543210'}</span>
            </p>
          </div>
        </div>

        <Link to="/marketplace">
          <Button variant="primary" size="md" icon={ShoppingBag} className="shadow-lg shadow-emerald-600/30">
            Browse Farm Produce
          </Button>
        </Link>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Active Farm Orders</span>
          <div className="text-2xl font-black text-sky-700 font-display">
            2 Shipments
          </div>
          <span className="text-[11px] text-emerald-700 font-bold block">Delivery Expected Tomorrow</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Middlemen Savings</span>
          <div className="text-2xl font-black text-emerald-600 font-display">
            ₹3,450 Saved
          </div>
          <span className="text-[11px] text-slate-500 block">32% Cheaper than Retail Marts</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Subscribed Local Farms</span>
          <div className="text-2xl font-black text-slate-900 font-display">
            4 Organic Farms
          </div>
          <span className="text-[11px] text-sky-700 font-bold block">Thanjavur & Coimbatore</span>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 font-display flex items-center gap-2">
              <Truck className="w-5 h-5 text-sky-600" />
              <span>Your Farm-Direct Shipments</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Track fresh produce dispatch directly from the harvesting farm.
            </p>
          </div>

          <Link to="/marketplace" className="text-xs font-bold text-sky-700 hover:underline">
            + Order More Fresh Produce
          </Link>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <span className="text-3xl p-2.5 bg-white rounded-2xl shadow-sm border border-slate-200">🌾</span>
              <div>
                <h4 className="text-base font-black text-slate-900">
                  Organic Ponni Boiled Rice (25 kg Bag)
                </h4>
                <p className="text-xs text-slate-500">
                  Farmer: K. Murugan • Thanjavur Farm • Harvest Date: 3 Days ago
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-between sm:justify-end">
              <span className="text-base font-black text-slate-900">₹1,450</span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Out for Delivery 🚚
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <span className="text-3xl p-2.5 bg-white rounded-2xl shadow-sm border border-slate-200">🍅</span>
              <div>
                <h4 className="text-base font-black text-slate-900">
                  Fresh Farm Country Tomatoes (10 kg Crate)
                </h4>
                <p className="text-xs text-slate-500">
                  Farmer: Ramesh Kumar • Salem APMC Farm
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-between sm:justify-end">
              <span className="text-base font-black text-slate-900">₹320</span>
              <span className="text-xs font-bold text-sky-800 bg-sky-100 px-3 py-1 rounded-full">
                Packed at Farm 📦
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
