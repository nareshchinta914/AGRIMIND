import React from 'react';
import { User, MapPin, Sprout, Layers, ShieldCheck, Edit3 } from 'lucide-react';
import Button from '../common/Button';
import { SOIL_TYPES } from '../../utils/constants';

const ProfileCard = ({ user, onEdit }) => {
  if (!user) return null;

  const soilName = SOIL_TYPES.find((s) => s.id === user.soilType)?.name || user.soilType || 'Alluvial Soil';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg p-6 sm:p-8 space-y-6">
      {/* Header Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-agri-600 to-agri-800 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-agri-600/30">
            {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-slate-900 font-display">{user.name}</h3>
              {user.isVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Farmer
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{user.district || 'Ludhiana'}, {user.state || 'Punjab'}</span>
            </p>
          </div>
        </div>

        {onEdit && (
          <Button variant="outline" size="sm" onClick={onEdit} icon={Edit3}>
            Edit Profile
          </Button>
        )}
      </div>

      {/* Farm Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-agri-50/60 border border-agri-100">
          <div className="flex items-center gap-2 text-agri-700 mb-1">
            <Layers className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Total Farm Land</span>
          </div>
          <p className="text-2xl font-black text-slate-900 font-display">
            {user.farmSize || 5.0} <span className="text-sm font-semibold text-slate-500">Acres</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-sunAmber-50/60 border border-sunAmber-100">
          <div className="flex items-center gap-2 text-sunAmber-700 mb-1">
            <Sprout className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Soil Profile</span>
          </div>
          <p className="text-base font-bold text-slate-900 truncate" title={soilName}>
            {soilName}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-skyAgri-50/60 border border-skyAgri-100">
          <div className="flex items-center gap-2 text-skyAgri-700 mb-1">
            <User className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Contact Phone</span>
          </div>
          <p className="text-base font-bold text-slate-900">
            {user.phone || '+91 98765 43210'}
          </p>
        </div>
      </div>

      {/* Primary Crops Badges */}
      {user.primaryCrops && user.primaryCrops.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Active Registered Crops
          </h4>
          <div className="flex flex-wrap gap-2">
            {user.primaryCrops.map((crop, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200/60 flex items-center gap-1.5"
              >
                <span>🌱</span>
                {crop}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
