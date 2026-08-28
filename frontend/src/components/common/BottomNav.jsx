import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Sparkles, ShoppingBag, Layers, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const BottomNav = () => {
  const { isAuthenticated } = useAuth();

  const items = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/features', label: 'Features', icon: Layers },
    { to: '/ai-assistant', label: 'Kisan AI', icon: Sparkles, highlight: true },
    { to: '/marketplace', label: 'Mandi', icon: ShoppingBag },
    { to: isAuthenticated ? '/profile' : '/login', label: 'Profile', icon: User },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-lg px-2 py-1.5 flex items-center justify-around safe-area-pb">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
              item.highlight
                ? isActive
                  ? 'text-agri-700 font-bold scale-105'
                  : 'text-agri-600 font-semibold'
                : isActive
                ? 'text-agri-700 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {item.highlight ? (
                <div
                  className={`w-10 h-10 -mt-4 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                    isActive
                      ? 'bg-gradient-to-tr from-sunAmber-500 to-agri-600 text-white scale-110 shadow-agri-600/30'
                      : 'bg-agri-600 text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                </div>
              ) : (
                <item.icon className="w-5 h-5 mb-0.5" />
              )}
              <span className={`text-[10px] tracking-tight ${item.highlight ? 'mt-0.5' : ''}`}>
                {item.label}
              </span>
              {isActive && !item.highlight && (
                <span className="w-1.5 h-1.5 rounded-full bg-agri-600 absolute -bottom-0.5"></span>
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
