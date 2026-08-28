import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import MobileBottomNav from '../components/dashboard/MobileBottomNav';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from '../hooks/useToast';
import {
  Home,
  Bell,
  Globe,
  User,
  Settings,
  Shield,
  LogOut,
  ChevronDown,
  ShoppingCart,
  MapPin,
  CheckCircle2,
  X
} from 'lucide-react';
import { orderService } from '../services/orderService';
import LanguageSelectorModal from '../components/common/LanguageSelectorModal';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { language, languages } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const menuRef = useRef(null);
  const notifRef = useRef(null);

  const cart = orderService.getCart();
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const role = (user?.role || 'FARMER').toUpperCase();
  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  // Dynamic user display values from authenticated session
  const displayName = user?.fullName || user?.name || (role === 'MERCHANT' ? user?.businessName : 'Account User');
  const displayLocation = user?.district ? `${user.district}, ${user.state || 'India'}` : (user?.state || 'India');

  const profilePath = role === 'MERCHANT' ? '/merchant/profile' : role === 'CUSTOMER' ? '/customer/profile' : '/farmer/profile';

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
    toast.info('Logged out from AGRIMIND');
    navigate('/login');
  };

  const sampleNotifications = [
    { id: 1, title: 'Weather Alert', desc: 'Rain expected tomorrow morning in your district.', time: '10m ago', unread: true },
    { id: 2, title: 'Mandi Update', desc: 'Paddy prices increased by ₹120/Quintal.', time: '1h ago', unread: true },
    { id: 3, title: 'Soil Report', desc: 'Your nitrogen & moisture levels are optimal.', time: '1d ago', unread: false }
  ];

  return (
    <div className="min-h-screen bg-[#f3f7f4] flex flex-col select-none">
      {/* ========================================================================= */}
      {/* 5. COMMON ACCOUNT HEADER                                                 */}
      {/* ========================================================================= */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40 shadow-lg">
        {/* Brand Logo & Role Tag */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl group-hover:scale-110 transition-transform">🌱</span>
            <span className="text-xl font-black font-display tracking-tight text-white">
              AGRIMIND
            </span>
          </Link>
          <span
            className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
              role === 'MERCHANT'
                ? 'bg-amber-400 text-slate-950'
                : role === 'CUSTOMER'
                ? 'bg-sky-400 text-slate-950'
                : 'bg-emerald-400 text-slate-950'
            }`}
          >
            {role}
          </span>
        </div>

        {/* Right Header Controls: Home, Language, Notifications, Cart, Account Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Go to Home Page Button */}
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-xs font-black text-emerald-300 border border-emerald-500/40 transition-all shadow-sm group"
            title="Return to Home Page"
          >
            <Home className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Home</span>
          </Link>

          {/* Language Selector */}
          <button
            type="button"
            onClick={() => setIsLangOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all cursor-pointer"
            title="Change Language"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{currentLangObj.name}</span>
          </button>

          {/* Customer & Merchant Cart Icon */}
          {(role === 'CUSTOMER' || role === 'MERCHANT') && (
            <Link
              to="/customer/cart"
              className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-all"
              title="Shopping Cart & Selected Items"
            >
              <ShoppingCart className="w-4 h-4 text-emerald-400" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-emerald-500 text-slate-950 rounded-full text-[10px] font-black flex items-center justify-center px-1 shadow-sm">
                  {totalCartItems}
                </span>
              )}
            </Link>
          )}

          {/* Notification Icon & Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-all cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 text-slate-900 py-3 z-50 animate-fadeIn">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Notifications
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                    2 New
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                  {sampleNotifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-slate-900">{n.title}</h5>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ===================================================================== */}
          {/* 6. ACCOUNT MENU & PROFILE AVATAR DROPDOWN                             */}
          {/* ===================================================================== */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer group"
            >
              {/* Profile Avatar */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-slate-950 ${
                  role === 'MERCHANT'
                    ? 'bg-amber-400'
                    : role === 'CUSTOMER'
                    ? 'bg-sky-400'
                    : 'bg-emerald-400'
                }`}
              >
                {role === 'MERCHANT' ? '🏢' : role === 'CUSTOMER' ? '🛒' : '🌾'}
              </div>

              {/* User Name & Role */}
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-white leading-tight truncate max-w-[120px]">
                  {displayName}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold leading-tight">
                  {role}
                </span>
              </div>

              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  isMenuOpen ? 'rotate-180 text-emerald-400' : ''
                }`}
              />
            </button>

            {/* Account Menu Dropdown */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 text-slate-900 py-2 z-50 animate-fadeIn divide-y divide-slate-100">
                {/* Account Header Details */}
                <div className="px-4 py-3 bg-slate-50/70 rounded-t-2xl">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-slate-950 ${
                        role === 'MERCHANT'
                          ? 'bg-amber-400'
                          : role === 'CUSTOMER'
                          ? 'bg-sky-400'
                          : 'bg-emerald-400'
                      }`}
                    >
                      {role === 'MERCHANT' ? '🏢' : role === 'CUSTOMER' ? '🛒' : '🌾'}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-black text-slate-900 truncate">
                        {displayName}
                      </h4>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        {role} ACCOUNT
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{displayLocation}</span>
                  </p>
                </div>

                {/* Account Menu Options */}
                <div className="py-1.5 text-xs font-bold text-slate-700">
                  <Link
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-emerald-50 text-emerald-800 font-black transition-colors border-b border-slate-100"
                  >
                    <Home className="w-4 h-4 text-emerald-600" />
                    <span>🏠 Back to Home Page</span>
                  </Link>

                  <Link
                    to={profilePath}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                  >
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>👤 My Profile</span>
                  </Link>

                  <Link
                    to={profilePath}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-500" />
                    <span>⚙️ Account Settings</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsLangOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-emerald-50 hover:text-emerald-900 transition-colors text-left cursor-pointer"
                  >
                    <Globe className="w-4 h-4 text-blue-500" />
                    <span>🌐 Language ({currentLangObj.nativeName})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsNotifOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-emerald-50 hover:text-emerald-900 transition-colors text-left cursor-pointer"
                  >
                    <Bell className="w-4 h-4 text-amber-500" />
                    <span>🔔 Notifications</span>
                  </button>

                  <Link
                    to="/forgot-password"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                  >
                    <Shield className="w-4 h-4 text-purple-500" />
                    <span>🔒 Security & Password</span>
                  </Link>
                </div>

                {/* Logout Option */}
                <div className="py-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>🚪 Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 flex pb-16 md:pb-0">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Language Selector Modal */}
      <LanguageSelectorModal isOpen={isLangOpen} onClose={() => setIsLangOpen(false)} />
    </div>
  );
};

export default DashboardLayout;
