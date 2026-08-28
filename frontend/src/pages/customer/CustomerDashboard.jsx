import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Store,
  Sprout,
  Package,
  Heart,
  MapPin,
  Search,
  ShoppingCart,
  User,
  Truck,
  ShieldCheck,
  ArrowRight,
  TrendingDown,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import ProductCard from '../../components/dashboard/ProductCard';
import StatCard from '../../components/dashboard/StatCard';
import Button from '../../components/common/Button';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchVal, setSearchVal] = useState('');

  // Authenticated customer name
  const customerName = user?.fullName || user?.name || 'Customer';

  useEffect(() => {
    const loadData = async () => {
      const resP = await productService.getProducts({ limit: 4 });
      setProducts(resP.products || []);
      const resO = await orderService.getOrders();
      setOrders(resO.orders || []);
    };
    loadData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/customer/products?search=${encodeURIComponent(searchVal)}`);
  };

  // Specified 8 Main Customer Features
  const customerFeatures = [
    {
      id: 'browse',
      title: '🛒 Browse Products',
      desc: 'Explore available agricultural products and grains',
      path: '/customer/products',
      color: 'bg-emerald-50 text-emerald-950 border-emerald-200 hover:border-emerald-400'
    },
    {
      id: 'fresh_farmers',
      title: '🌾 Fresh From Farmers',
      desc: 'Find organic crops directly from verified growers',
      path: '/customer/products?role=FARMER',
      color: 'bg-sky-50 text-sky-950 border-sky-200 hover:border-sky-400'
    },
    {
      id: 'search',
      title: '🔍 Search Marketplace',
      desc: 'Search crops, spices, vegetables and pulses',
      path: '/customer/products',
      color: 'bg-amber-50 text-amber-950 border-amber-200 hover:border-amber-400'
    },
    {
      id: 'wishlist',
      title: '❤️ Wishlist',
      desc: 'View your saved produce and favorite farms',
      path: '/customer/wishlist',
      color: 'bg-rose-50 text-rose-950 border-rose-200 hover:border-rose-400'
    },
    {
      id: 'orders',
      title: '📦 My Orders',
      desc: 'Track live farm-to-door purchases & shipments',
      path: '/customer/orders',
      color: 'bg-purple-50 text-purple-950 border-purple-200 hover:border-purple-400'
    },
    {
      id: 'cart',
      title: '🛍️ Shopping Cart',
      desc: 'View items ready for instant direct checkout',
      path: '/customer/cart',
      color: 'bg-teal-50 text-teal-950 border-teal-200 hover:border-teal-400'
    },
    {
      id: 'address',
      title: '📍 Delivery Address',
      desc: user?.deliveryAddress || 'Manage shipping location & contact',
      path: '/customer/profile',
      color: 'bg-blue-50 text-blue-950 border-blue-200 hover:border-blue-400'
    },
    {
      id: 'profile',
      title: '👤 My Profile',
      desc: 'Manage your customer account and preferences',
      path: '/customer/profile',
      color: 'bg-lime-50 text-lime-950 border-lime-200 hover:border-lime-400'
    }
  ];

  return (
    <div className="space-y-8 select-none">
      {/* Customer Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-400 text-slate-950 flex items-center justify-center font-black text-3xl shadow-lg flex-shrink-0">
            🛒
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-sky-400 text-slate-950 px-2.5 py-0.5 rounded-full">
                Customer Dashboard
              </span>
              <span className="text-xs text-sky-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Direct From Farmers
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-white mt-1">
              Welcome, {customerName} 👋
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              📍 {user?.deliveryAddress || `${user?.district || 'Chennai'}, ${user?.state || 'Tamil Nadu'}`} • Active Orders: <strong>{orders.length}</strong>
            </p>
          </div>
        </div>

        <Link to="/customer/products">
          <Button variant="primary" size="md" icon={ShoppingBag} className="shadow-lg shadow-emerald-600/30">
            Browse All Products
          </Button>
        </Link>
      </div>

      {/* Direct Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          placeholder="Search farm-fresh crops, vegetables, grains (e.g., Organic Rice, Tomato, Turmeric)..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          className="w-full pl-12 pr-28 py-3 rounded-2xl bg-white border-2 border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-sky-500 shadow-sm"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Orders"
          value={orders.length}
          subtitle="Direct shipment from harvesting farms"
          icon={Truck}
          color="sky"
        />
        <StatCard
          title="Direct Sourcing Savings"
          value="₹3,450"
          subtitle="30-40% Cheaper than supermarkets"
          icon={TrendingDown}
          color="emerald"
        />
        <StatCard
          title="Subscribed Organic Farms"
          value="4"
          subtitle="Verified growers in your state"
          icon={Sprout}
          color="purple"
        />
      </div>

      {/* 8 Customer Feature Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-slate-900 font-display">
          Customer Features & Services
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {customerFeatures.map((f) => (
            <Link key={f.id} to={f.path}>
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                className={`p-5 rounded-3xl border-2 shadow-sm h-full flex flex-col justify-between gap-3 ${f.color} transition-all`}
              >
                <div className="space-y-1">
                  <h4 className="text-base font-black text-slate-900 font-display">{f.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
                </div>

                <span className="text-xs font-bold text-sky-800 flex items-center justify-between pt-2 border-t border-slate-200/50">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Fresh From Farmers Product Spotlight */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-600" />
            <span>Fresh From Farmers (Direct Harvest Plucked)</span>
          </h3>
          <Link to="/customer/products" className="text-xs font-bold text-emerald-700 hover:underline">
            View All Products ({products.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
