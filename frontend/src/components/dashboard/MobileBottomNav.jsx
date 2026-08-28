import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  Sprout,
  Store,
  Bot,
  User,
  Package,
  ShoppingCart,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { orderService } from '../../services/orderService';

const MobileBottomNav = () => {
  const { user } = useAuth();
  const role = (user?.role || 'FARMER').toUpperCase();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const cart = orderService.getCart();
      const count = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
      setCartCount(count);
    };

    updateCount();
    window.addEventListener('storage', updateCount);
    const interval = setInterval(updateCount, 1000);
    return () => {
      window.removeEventListener('storage', updateCount);
      clearInterval(interval);
    };
  }, []);

  const farmerLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Dashboard', path: '/farmer/dashboard', icon: LayoutDashboard },
    { name: 'Crops', path: '/farmer/crops', icon: Sprout },
    { name: 'AI Voice', path: '/farmer/assistant', icon: Bot },
    { name: 'Market', path: '/farmer/marketplace', icon: Store },
    { name: 'Profile', path: '/farmer/profile', icon: User }
  ];

  const customerLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Hub', path: '/customer/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/customer/products', icon: Store },
    { name: 'Cart', path: '/customer/cart', icon: ShoppingCart, hasBadge: true },
    { name: 'Orders', path: '/customer/orders', icon: Package },
    { name: 'Profile', path: '/customer/profile', icon: User }
  ];

  const merchantLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Hub', path: '/merchant/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/merchant/products', icon: Package },
    { name: 'Cart', path: '/customer/cart', icon: ShoppingCart, hasBadge: true },
    { name: 'Orders', path: '/merchant/orders', icon: Store },
    { name: 'Profile', path: '/merchant/profile', icon: User }
  ];

  const currentLinks = role === 'MERCHANT' ? merchantLinks : role === 'CUSTOMER' ? customerLinks : farmerLinks;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-2 flex items-center justify-around select-none shadow-2xl">
      {currentLinks.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all relative ${
                isActive
                  ? 'text-emerald-400 font-black scale-105'
                  : 'text-slate-400 hover:text-slate-200 text-[11px]'
              }`
            }
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {link.hasBadge && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 bg-emerald-500 text-slate-950 text-[9px] font-black rounded-full flex items-center justify-center px-1 shadow-sm animate-pulse">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px]">{link.name}</span>
          </NavLink>
        );
      })}
    </div>
  );
};

export default MobileBottomNav;
