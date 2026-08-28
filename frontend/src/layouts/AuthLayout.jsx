import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sprout, ArrowLeft } from 'lucide-react';
import LanguageSelector from '../components/common/LanguageSelector';
import OfflineIndicator from '../components/common/OfflineIndicator';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-agri-950 via-slate-900 to-agri-950 text-slate-100 relative overflow-hidden">
      <OfflineIndicator />

      {/* Decorative agricultural glow & particles */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-agri-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sunAmber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-3">
          <LanguageSelector />
        </div>
      </header>

      {/* Center Form Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex flex-col items-center justify-center mb-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-agri-500 to-agri-700 flex items-center justify-center text-white shadow-xl shadow-agri-600/30 group-hover:scale-105 transition-transform">
                <Sprout className="w-7 h-7 text-agri-100" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white font-display">
                AGRI<span className="text-agri-400">MIND</span>
              </span>
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-900 border border-slate-100">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="relative z-10 py-6 text-center text-xs text-slate-500">
        <p>AGRIMIND — Smart Farming. Better Decisions. Better Future.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
