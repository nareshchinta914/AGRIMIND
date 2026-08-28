import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  Sprout,
  Droplets,
  CloudSun,
  Calculator,
  BarChart3,
  CalendarDays,
  Bot,
  Store,
  User,
  ShoppingBag,
  Package,
  Heart,
  ShoppingCart,
  PlusCircle,
  TrendingUp,
  LogOut,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const role = (user?.role || 'FARMER').toUpperCase();

  const farmerNav = [
    { name: 'Dashboard', path: '/farmer/dashboard', icon: LayoutDashboard },
    { name: 'Crop Recommendation', path: '/farmer/crops', icon: Sprout },
    { name: 'Water Advice', path: '/farmer/water', icon: Droplets },
    { name: 'Weather Radar', path: '/farmer/weather', icon: CloudSun },
    { name: 'Farm Cost & Profit', path: '/farmer/cost', icon: Calculator },
    { name: 'Farm Reports', path: '/farmer/reports', icon: BarChart3 },
    { name: 'Farm Activities', path: '/farmer/activities', icon: CalendarDays },
    { name: 'Kisan AI Saathi', path: '/farmer/assistant', icon: Bot },
    { name: 'Sell on Marketplace', path: '/farmer/marketplace', icon: Store },
    { name: 'Farmer Profile', path: '/farmer/profile', icon: User }
  ];

  const customerNav = [
    { name: 'Customer Hub', path: '/customer/dashboard', icon: LayoutDashboard },
    { name: 'Browse Products', path: '/customer/products', icon: Store },
    { name: 'Shopping Cart', path: '/customer/cart', icon: ShoppingCart },
    { name: 'My Orders', path: '/customer/orders', icon: Package },
    { name: 'Wishlist', path: '/customer/wishlist', icon: Heart },
    { name: 'My Profile', path: '/customer/profile', icon: User }
  ];

  const merchantNav = [
    { name: 'Merchant Hub', path: '/merchant/dashboard', icon: LayoutDashboard },
    { name: 'Product Inventory', path: '/merchant/products', icon: Package },
    { name: 'Add Product', path: '/merchant/products/add', icon: PlusCircle },
    { name: 'Orders & Shipments', path: '/merchant/orders', icon: ShoppingBag },
    { name: 'Sales & Revenue', path: '/merchant/sales', icon: TrendingUp },
    { name: 'Business Profile', path: '/merchant/profile', icon: User }
  ];

  const currentNav = role === 'MERCHANT' ? merchantNav : role === 'CUSTOMER' ? customerNav : farmerNav;

  const handleLogout = async () => {
    await logout();
    toast.info('Logged out from AGRIMIND');
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-4 border-r border-slate-800 select-none min-h-[calc(100vh-4rem)] hidden md:flex">
      <div className="space-y-6">
        {/* User Identity Pill */}
        <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black text-lg">
            {role === 'MERCHANT' ? '🏢' : role === 'CUSTOMER' ? '🛒' : '🌾'}
          </div>
          <div className="overflow-hidden">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block truncate">
              {role === 'MERCHANT' ? '🏢 Merchant' : role === 'CUSTOMER' ? '🛒 Customer' : '🌾 Farmer'}
            </span>
            <h4 className="text-xs font-bold text-white truncate font-display">
              {user?.fullName || user?.name || (role === 'MERCHANT' ? user?.businessName : 'Account User')}
            </h4>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {/* Quick Go to Home Page Button */}
          <Link
            to="/"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-black text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-700/50 transition-all mb-3 shadow-sm group"
          >
            <Home className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform flex-shrink-0" />
            <span className="truncate">🏠 Go to Home Page</span>
          </Link>

          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 block mb-2">
            Main Menu
          </span>
          {currentNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-black'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className="pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
