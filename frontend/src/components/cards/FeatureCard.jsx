import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCard = ({
  id,
  title,
  hindiTitle,
  description,
  icon: Icon,
  ctaText = 'Open Tool',
  to = '/features',
  badge,
  gradient = 'from-emerald-500/10 to-teal-500/5',
  iconBg = 'bg-agri-600 text-white',
  accentColor = 'border-agri-200',
  onAction,
}) => {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white border ${accentColor} shadow-md hover:shadow-2xl hover:border-agri-500 transition-all duration-300 overflow-hidden`}
    >
      {/* Subtle background gradient glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none`} />

      <div>
        {/* Top Header with Icon & Badge */}
        <div className="relative flex items-start justify-between gap-4 mb-5">
          <div
            className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
          >
            {Icon && <Icon className="w-7 h-7" />}
          </div>

          {badge && (
            <span className="px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full bg-slate-900 text-amber-300 shadow-sm border border-amber-300/30">
              {badge}
            </span>
          )}
        </div>

        {/* Title & Description */}
        <div className="relative space-y-1.5 mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display group-hover:text-agri-700 transition-colors">
            {title}
          </h3>
          {hindiTitle && (
            <p className="text-xs font-semibold text-agri-600 tracking-wide">
              {hindiTitle}
            </p>
          )}
          <p className="text-sm text-slate-600 leading-relaxed pt-1">
            {description}
          </p>
        </div>
      </div>

      {/* Action CTA */}
      <div className="relative pt-4 border-t border-slate-100/80 flex items-center justify-between">
        {to ? (
          <Link
            to={to}
            className="inline-flex items-center gap-2 text-sm font-bold text-agri-700 group-hover:text-agri-800 transition-colors w-full justify-between"
          >
            <span>{ctaText}</span>
            <div className="w-8 h-8 rounded-full bg-agri-100 text-agri-700 flex items-center justify-center group-hover:bg-agri-600 group-hover:text-white transition-all">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ) : (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-2 text-sm font-bold text-agri-700 group-hover:text-agri-800 transition-colors w-full justify-between"
          >
            <span>{ctaText}</span>
            <div className="w-8 h-8 rounded-full bg-agri-100 text-agri-700 flex items-center justify-center group-hover:bg-agri-600 group-hover:text-white transition-all">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default FeatureCard;
