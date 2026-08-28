import React from 'react';
import { Sprout, ShieldCheck, HeartHandshake, Award, Cpu, Globe2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const AboutPage = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-12">
      {/* Intro Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-agri-100 text-agri-800 text-xs font-black uppercase tracking-wider">
          <Sprout className="w-4 h-4 text-agri-600" />
          <span>Our Agricultural Mission</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 font-display tracking-tight">
          Empowering Indian Farmers with Artificial Intelligence
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          AGRIMIND was founded with a clear vision: to bring cutting-edge agro-meteorological AI, soil-calibrated decision intelligence, and direct mandi access to every farmer across Bharat.
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-md space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-display">Precision Agriculture</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Eliminating guesswork in seed selection, N-P-K fertilizer balancing, and irrigation schedules through machine learning models.
          </p>
        </div>

        <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-md space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sunAmber-100 text-sunAmber-700 flex items-center justify-center">
            <Globe2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-display">Hyper-Local Weather</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Integrating satellite radar and IMD agro-advisories to protect crops from unseasonal rains and optimize foliar spray timings.
          </p>
        </div>

        <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-md space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-skyAgri-100 text-skyAgri-700 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-display">Fair Mandi Prosperity</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Real-time APMC mandi commodity rates and direct farmer-to-farmer equipment/seed marketplace to maximize farmer profit margins.
          </p>
        </div>
      </div>

      {/* Govt Alignment & Trust */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
          <h2 className="text-2xl font-bold font-display text-white">Aligned with National Agri Frameworks</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          AGRIMIND algorithms follow the scientific agronomy standards established by ICAR (Indian Council of Agricultural Research), State Agricultural Universities (SAUs), and the National Soil Health Card Scheme.
        </p>
        <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-slate-300">
          <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">✓ 100% Free for Smallholder Farmers</span>
          <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">✓ Hindi & Regional Language First</span>
          <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">✓ PWA Offline Field Mode</span>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link to="/features">
          <Button variant="primary" size="xl">
            Explore Free AI Features Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
