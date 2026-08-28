import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Sprout,
  ShieldCheck,
  Edit3,
  Check,
  Layers,
  Save,
  Globe
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../../hooks/useToast';
import { INDIAN_STATES, DISTRICT_MAP, SOIL_TYPES } from '../../utils/constants';
import { validatePhone } from '../../utils/validators';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';

const FarmerProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { language, languages, setLanguage, t } = useLanguage();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [phoneError, setPhoneError] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.fullName || user?.name || 'Farmer Account',
    phone: user?.mobileNumber || user?.phone || '',
    email: user?.email || '',
    state: user?.state || 'Tamil Nadu',
    district: user?.district || 'Thanjavur',
    village: user?.village || 'Papanasam',
    farmSize: user?.farmSize || '5.0',
    farmSizeUnit: user?.farmSizeUnit || 'Acres',
    soilType: user?.soilType || 'alluvial',
    currentCrop: user?.currentCrop || 'Paddy (Ponni)',
    pmKisanId: user?.pmKisanId || 'PMK-TN-2024-88910',
    experienceYears: user?.experienceYears || '12 Years',
    preferredLanguage: user?.preferredLanguage || language || 'en'
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.fullName || user.name || prev.name,
        phone: user.mobileNumber || user.phone || prev.phone,
        email: user.email || prev.email,
        state: user.state || prev.state,
        district: user.district || prev.district,
        village: user.village || prev.village,
        farmSize: user.farmSize || prev.farmSize,
        soilType: user.soilType || prev.soilType,
        currentCrop: user.currentCrop || prev.currentCrop,
        pmKisanId: user.pmKisanId || prev.pmKisanId,
        experienceYears: user.experienceYears || prev.experienceYears,
        preferredLanguage: user.preferredLanguage || language || prev.preferredLanguage
      }));
    }
  }, [user, language]);

  const availableDistricts = DISTRICT_MAP[formData.state] || ['Thanjavur', 'Madurai', 'Coimbatore'];

  const handleSave = async (e) => {
    e.preventDefault();
    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) {
      setPhoneError(phoneErr);
      return;
    }
    setPhoneError(null);

    setIsSaving(true);
    try {
      await updateProfile(formData);
      if (formData.preferredLanguage !== language) {
        setLanguage(formData.preferredLanguage);
      }
      setIsEditing(false);
      toast.success('Farmer profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 select-none max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-400 text-slate-950 flex items-center justify-center font-black text-3xl shadow-lg flex-shrink-0">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-full">
                Account Type: FARMER
              </span>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> PM-KISAN Verified
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display mt-1">
              {formData.name}
            </h2>
            <p className="text-xs text-slate-400">
              📍 {formData.village ? `${formData.village}, ` : ''}{formData.district}, {formData.state}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all border border-white/10 cursor-pointer self-start sm:self-auto"
        >
          <Edit3 className="w-4 h-4 text-emerald-400" />
          <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Form / Profile Info Cards */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal & Contact Details */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-700" />
            <span>Personal & Regional Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.name}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon={User}
              required
            />

            <Input
              label="Mobile Number"
              value={formData.phone}
              disabled={!isEditing}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                setFormData({ ...formData, phone: val });
              }}
              icon={Phone}
              error={phoneError}
              required
            />

            <Input
              label="Email Address"
              value={formData.email}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              icon={Mail}
              type="email"
            />

            <Select
              label="Preferred Language (முன்னுரிமை மொழி)"
              options={languages.map((l) => ({ value: l.code, label: `${l.nativeName} (${l.name})` }))}
              value={formData.preferredLanguage}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            <Select
              label="State"
              options={INDIAN_STATES}
              value={formData.state}
              disabled={!isEditing}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  state: e.target.value,
                  district: DISTRICT_MAP[e.target.value]?.[0] || 'District Headquarter'
                })
              }
            />

            <Select
              label="District"
              options={availableDistricts}
              value={formData.district}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            />

            <Input
              label="Village / Gram Panchayat"
              value={formData.village}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, village: e.target.value })}
              icon={MapPin}
            />
          </div>
        </div>

        {/* Agricultural Farm Details */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-700" />
            <span>Farm Landholding & Crop Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Total Farm Land Area"
              type="number"
              step="0.1"
              value={formData.farmSize}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
            />

            <Select
              label="Unit"
              options={['Acres', 'Hectares', 'Bigha', 'Guntha']}
              value={formData.farmSizeUnit}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, farmSizeUnit: e.target.value })}
            />

            <Select
              label="Primary Soil Type"
              options={SOIL_TYPES.map((s) => ({ value: s.id, label: s.name.split('(')[0] }))}
              value={formData.soilType}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <Input
              label="Current Standing Crop"
              value={formData.currentCrop}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, currentCrop: e.target.value })}
              placeholder="e.g. Paddy / Cotton / Tomato"
            />

            <Input
              label="PM-KISAN Registration ID"
              value={formData.pmKisanId}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, pmKisanId: e.target.value })}
              placeholder="PMK-TN-2024-88910"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <Input
              label="Farming Experience"
              value={formData.experienceYears}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
              placeholder="e.g. 10 Years"
            />

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <span className="text-lg">🌿</span>
              <span>
                <strong>Smart Advisory:</strong> Recommendations are tailored to <strong>{formData.soilType}</strong> soil in <strong>{formData.district}</strong>.
              </span>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              icon={Save}
            >
              Save Profile Changes
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default FarmerProfilePage;
