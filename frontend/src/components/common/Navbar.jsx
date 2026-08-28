import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sprout, Menu, X, User, LogOut, Sparkles, ShoppingBag, Layers, PhoneCall } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import LanguageSelector from './LanguageSelector';
import LocationSelector from './LocationSelector';
import Button from './Button';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: t('home') },
    { to: '/features', label: t('features'), icon: Layers },
    { to: '/marketplace', label: t('marketplace'), icon: ShoppingBag },
    { to: '/ai-assistant', label: t('aiAssistant'), badge: 'AI', icon: Sparkles },
    { to: '/about', label: t('about') },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-900/10 bg-white/95 backdrop-blur-md transition-all select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group select-none"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-agri-600 to-agri-800 flex items-center justify-center text-white shadow-lg shadow-agri-600/30 group-hover:scale-105 transition-transform">
              <Sprout className="w-7 h-7 text-agri-200" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-900 font-display">
                AGRI<span className="text-agri-600">MIND</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-600">
                AI Smart Farming
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-agri-50 text-agri-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {link.icon && <link.icon className="w-4 h-4 text-agri-600" />}
                <span>{link.label}</span>
                {link.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-sunAmber-400 text-slate-900 rounded-md">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-2 xl:gap-3">
            <LocationSelector />
            <LanguageSelector />

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/profile">
                  <Button variant="outline" size="sm" icon={User}>
                    <span className="max-w-[100px] truncate">{user?.name?.split(' ')[0] || user?.fullName?.split(' ')[0] || 'Profile'}</span>
                  </Button>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    {t('login')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    {t('signup')}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2 sm:hidden">
            <LanguageSelector />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-4 pb-6 space-y-4 shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <LocationSelector />
            <a
              href="tel:18001801551"
              className="flex items-center gap-1.5 text-xs font-bold text-agri-700 bg-agri-50 px-3 py-1.5 rounded-lg border border-agri-200"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>1800-180-1551</span>
            </a>
          </div>

          <div className="grid gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold text-slate-800 hover:bg-agri-50 active:bg-agri-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {link.icon && <link.icon className="w-5 h-5 text-agri-600" />}
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-sunAmber-400 text-slate-900 rounded-md">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-slate-800 hover:bg-slate-50"
                >
                  <User className="w-5 h-5 text-agri-600" />
                  <span>Profile ({user?.name || user?.fullName})</span>
                </Link>
                <Button variant="danger" size="md" onClick={handleLogout} icon={LogOut}>
                  Logout
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="md" className="w-full">
                    {t('login')}
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" className="w-full">
                    {t('signup')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
