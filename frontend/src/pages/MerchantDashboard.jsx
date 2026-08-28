import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Building2,
  TrendingUp,
  ShieldCheck,
  Phone,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  ArrowRight,
  MessageSquare,
  PackageCheck,
  Scale
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';

const MerchantDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8 select-none">
      {/* Merchant Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg">
            🏢
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-3 py-0.5 rounded-full">
                🏢 Grain Miller & Commodity Merchant Hub
              </span>
              <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> APMC & GST Verified
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display mt-1">
              {user?.businessName || user?.name || 'Sri Lakshmi Modern Rice Mill'}
            </h1>
            <p className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
              <span>📍 {user?.district || 'Thanjavur'}, {user?.state || 'Tamil Nadu'}</span>
              <span>•</span>
              <span>GST: {user?.gstNumber || '33AAAAA0000A1Z5'}</span>
            </p>
          </div>
        </div>

        <Link to="/marketplace">
          <Button variant="amber" size="md" icon={TrendingUp}>
            Post Buying Price
          </Button>
        </Link>
      </div>

      {/* Procurement Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Season Quota Target</span>
          <div className="text-2xl font-black text-slate-900 font-display">
            1,500 <span className="text-xs text-slate-500 font-normal">Tons</span>
          </div>
          <span className="text-[11px] text-amber-700 font-bold block">Paddy & Wheat</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Procured So Far</span>
          <div className="text-2xl font-black text-emerald-700 font-display">
            840 Tons
          </div>
          <span className="text-[11px] text-slate-500 block">56% of Quota Complete</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Connected Farmers</span>
          <div className="text-2xl font-black text-slate-900 font-display">
            128 Farmers
          </div>
          <span className="text-[11px] text-emerald-700 font-bold block">Direct Sourcing</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Live Deal Inquiries</span>
          <div className="text-2xl font-black text-amber-600 font-display">
            4 Offers Today
          </div>
          <span className="text-[11px] text-slate-500 block">Pending Farmer Deals</span>
        </div>
      </div>

      {/* Incoming Farmer Harvest Offers */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 font-display flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-amber-600" />
              <span>Incoming Farmer Harvest Broadcasts</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Farmers in your region looking to sell their harvest directly to your mill/business.
            </p>
          </div>

          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            ● 4 Live Inquiries
          </span>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <span className="text-3xl p-2.5 bg-white rounded-2xl shadow-sm border border-slate-200">🌾</span>
              <div>
                <h4 className="text-base font-black text-slate-900">
                  BPT-5204 (Samba Mahsuri) Paddy — 150 Bags (~11.2 Tons)
                </h4>
                <p className="text-xs text-slate-500">
                  Farmer: S. Sundaram • Kumbakonam, Thanjavur • Moisture: 13.5% (Ideal)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-between sm:justify-end">
              <span className="text-base font-black text-slate-900">₹2,520/Qtl</span>
              <a
                href="tel:9842109876"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call & Accept Deal</span>
              </a>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <span className="text-3xl p-2.5 bg-white rounded-2xl shadow-sm border border-slate-200">🌿</span>
              <div>
                <h4 className="text-base font-black text-slate-900">
                  Bt Cotton (RCH 659) — 80 Quintals
                </h4>
                <p className="text-xs text-slate-500">
                  Farmer: G. Velusamy • Tirupur APMC Region • Staple Length: 29mm
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-between sm:justify-end">
              <span className="text-base font-black text-slate-900">₹7,050/Qtl</span>
              <a
                href="tel:9842109876"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call & Accept Deal</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantDashboard;
