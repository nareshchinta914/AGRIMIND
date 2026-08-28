import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Building2,
  Package,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Users,
  ShieldCheck,
  PlusCircle,
  ArrowRight,
  Phone,
  Store,
  FileText
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import StatCard from '../../components/dashboard/StatCard';
import Button from '../../components/common/Button';

const MerchantDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // Authenticated merchant name
  const merchantName = user?.businessName || user?.fullName || user?.name || 'Merchant Enterprise';

  useEffect(() => {
    const loadData = async () => {
      const resP = await productService.getProducts({ limit: 4 });
      setProducts(resP.products || []);
      const resO = await orderService.getOrders();
      setOrders(resO.orders || []);
    };
    loadData();
  }, []);

  // Specified Merchant Operations & Cards
  const merchantFeatures = [
    {
      id: 'inventory',
      title: '📦 Product Inventory',
      desc: 'Manage grain, paddy & processed stock inventory',
      path: '/merchant/products',
      count: '18 Active Listings',
      color: 'bg-emerald-50 text-emerald-950 border-emerald-200 hover:border-emerald-400'
    },
    {
      id: 'add_product',
      title: '➕ Add Product',
      desc: 'Create new wholesale commodity & grain listing',
      path: '/merchant/products/add',
      count: 'Instant Listing',
      color: 'bg-amber-50 text-amber-950 border-amber-200 hover:border-amber-400'
    },
    {
      id: 'orders',
      title: '🛒 Orders & Shipments',
      desc: 'Process buyer deliveries and dispatch queue',
      path: '/merchant/orders',
      count: `${orders.length} Incoming Orders`,
      color: 'bg-sky-50 text-sky-950 border-sky-200 hover:border-sky-400'
    },
    {
      id: 'sales',
      title: '📊 Sales & Revenue',
      desc: 'Season volume procurement & milling margins',
      path: '/merchant/sales',
      count: '₹18,45,000 Procured',
      color: 'bg-purple-50 text-purple-950 border-purple-200 hover:border-purple-400'
    },
    {
      id: 'sourcing',
      title: '👥 Farmer Sourcing',
      desc: 'Connect with local harvesting farmers for direct procurement',
      path: '/marketplace',
      count: '128 Direct Farmers',
      color: 'bg-teal-50 text-teal-950 border-teal-200 hover:border-teal-400'
    },
    {
      id: 'profile',
      title: '🏢 Business Profile',
      desc: 'Manage APMC license, GSTIN, and milling enterprise details',
      path: '/merchant/profile',
      count: 'Verified APMC',
      color: 'bg-lime-50 text-lime-950 border-lime-200 hover:border-lime-400'
    }
  ];

  return (
    <div className="space-y-8 select-none">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-black text-3xl shadow-lg flex-shrink-0">
            🏢
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full">
                Merchant Dashboard
              </span>
              <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> APMC & GST Verified
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-white mt-1">
              Welcome, {merchantName} 👋
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              📍 {user?.district || 'Thanjavur'}, {user?.state || 'Tamil Nadu'} • GSTIN: <strong>{user?.gstNumber || '33AAAAA0000A1Z5'}</strong>
            </p>
          </div>
        </div>

        <Link to="/merchant/products/add">
          <Button variant="amber" size="md" icon={PlusCircle} className="shadow-lg shadow-amber-500/20">
            + Add New Product Listing
          </Button>
        </Link>
      </div>

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard title="📦 Products" value="18" unit="Active" subtitle="In Inventory" icon={Package} color="emerald" />
        <StatCard title="🛒 Orders" value={orders.length} unit="Active" subtitle="Dispatch Queue" icon={ShoppingBag} color="sky" />
        <StatCard title="💰 Sales" value="₹18.4L" subtitle="Gross Sourced" icon={TrendingUp} color="amber" />
        <StatCard title="📊 Revenue" value="₹4.2L" subtitle="Net Margins" icon={DollarSign} color="purple" />
        <StatCard title="👥 Sourcing" value="128" unit="Farmers" subtitle="Direct Network" icon={Users} color="teal" />
      </div>

      {/* 6 Merchant Feature Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-slate-900 font-display">
          Merchant Operations & Commodity Sourcing
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {merchantFeatures.map((c) => (
            <Link key={c.id} to={c.path}>
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                className={`p-5 rounded-3xl border-2 shadow-sm h-full flex flex-col justify-between gap-4 ${c.color} transition-all`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-black text-slate-900 font-display">{c.title}</h4>
                    <span className="text-[11px] font-black text-emerald-800 bg-white/70 px-2 py-0.5 rounded-lg border border-slate-200">
                      {c.count}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{c.desc}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs font-bold text-slate-900">
                  <span>Manage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Live Farmer Harvest Direct Offers */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-600" />
            <span>Live Farmer Harvest Sourcing Offers (Direct Bids)</span>
          </h3>
          <Link to="/merchant/products" className="text-xs font-bold text-amber-800 hover:underline">
            Manage Inventory →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 bg-white rounded-2xl shadow-sm border border-slate-200">🌾</span>
              <div>
                <h4 className="text-sm font-black text-slate-900">
                  BPT-5204 Paddy — 150 Bags (~11.2 Tons)
                </h4>
                <p className="text-xs text-slate-500">Farmer: S. Sundaram • Kumbakonam APMC</p>
                <span className="text-xs font-black text-emerald-700">₹2,520 / Quintal</span>
              </div>
            </div>
            <a
              href="tel:9842109876"
              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-emerald-700"
            >
              <Phone className="w-3.5 h-3.5" /> Call
            </a>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 bg-white rounded-2xl shadow-sm border border-slate-200">🌿</span>
              <div>
                <h4 className="text-sm font-black text-slate-900">
                  Bt Cotton — 80 Quintals (29mm Staple)
                </h4>
                <p className="text-xs text-slate-500">Farmer: G. Velusamy • Tirupur Yard</p>
                <span className="text-xs font-black text-emerald-700">₹7,050 / Quintal</span>
              </div>
            </div>
            <a
              href="tel:9842109876"
              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-emerald-700"
            >
              <Phone className="w-3.5 h-3.5" /> Call
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantDashboard;
