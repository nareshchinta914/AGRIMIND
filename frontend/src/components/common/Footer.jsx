import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, PhoneCall, ShieldCheck, HeartHandshake, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 sm:pb-12 border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {/* Brand & Helpline */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agri-500 to-agri-700 flex items-center justify-center text-white shadow-md">
                <Sprout className="w-6 h-6 text-agri-100" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white font-display">
                AGRI<span className="text-agri-400">MIND</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t('footerText')}
            </p>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-agri-600/20 text-agri-400 flex items-center justify-center flex-shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400">Kisan Toll-Free Helpline</p>
                <a href="tel:18001801551" className="text-base font-bold text-white hover:text-agri-400 transition-colors">
                  1800-180-1551
                </a>
              </div>
            </div>
          </div>

          {/* Quick Platform Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 font-display flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-agri-500"></span>
              Core Features
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/features" className="hover:text-agri-400 transition-colors">
                  🌱 Crop Recommendation AI
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-agri-400 transition-colors">
                  💧 Precision Water & Irrigation
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-agri-400 transition-colors">
                  🌦️ Monsoon & Weather Forecast
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-agri-400 transition-colors">
                  💰 Farm Cost & Profit Calculator
                </Link>
              </li>
              <li>
                <Link to="/ai-assistant" className="hover:text-agri-400 transition-colors">
                  🤖 Kisan Saathi AI Chatbot
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="hover:text-agri-400 transition-colors">
                  🛒 Farmer Mandi & Marketplace
                </Link>
              </li>
            </ul>
          </div>

          {/* Indian Govt Agri Schemes */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 font-display flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sunAmber-400"></span>
              Govt. Farmer Schemes
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://pmkisan.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sunAmber-400 transition-colors flex items-center justify-between group"
                >
                  <span>PM-KISAN Samman Nidhi</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="https://soilhealth.dac.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sunAmber-400 transition-colors flex items-center justify-between group"
                >
                  <span>Soil Health Card Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmfby.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sunAmber-400 transition-colors flex items-center justify-between group"
                >
                  <span>PM Fasal Bima Yojana (Crop Insurance)</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="https://enam.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sunAmber-400 transition-colors flex items-center justify-between group"
                >
                  <span>e-NAM (National Agri Market)</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>

          {/* Trust & Verification */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base mb-2 font-display flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-skyAgri-400"></span>
              Farmer Trust
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              AGRIMIND leverages advanced satellite agro-meteorological data, ICAR guidelines, and local APMC mandi integrations.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <ShieldCheck className="w-5 h-5 text-agri-400" />
              <span>100% Free for Individual Farmers</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <HeartHandshake className="w-5 h-5 text-sunAmber-400" />
              <span>Built for Bharat Kisan</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AGRIMIND Technologies India. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/about" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <Link to="/about" className="hover:text-slate-300 transition-colors">
              Security & Data
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
