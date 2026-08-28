import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  MapPin,
  Sprout,
  Droplets,
  Calculator,
  ShieldCheck,
  Edit3,
  LogOut,
  Bell,
  CheckCircle2,
  FileText,
  ShoppingBag,
  Building2,
  Phone,
  Truck,
  TrendingUp,
  Calendar,
  MessageSquare,
  Sparkles,
  Layers,
  Camera,
  Check,
  Plus
} from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useLanguage } from '../hooks/useLanguage';
import { INDIAN_STATES, DISTRICT_MAP, SOIL_TYPES } from '../utils/constants';
import { validatePhone } from '../utils/validators';
import { Link, useNavigate } from 'react-router-dom';
import SoilScannerModal from '../components/soil/SoilScannerModal';

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSoilScannerOpen, setIsSoilScannerOpen] = useState(false);
  const [phoneError, setPhoneError] = useState(null);

  // Active Role ('farmer', 'customer', 'merchant')
  const userRole = user?.role || 'farmer';

  const [editForm, setEditForm] = useState({
    name: user?.name || 'Naresh Chinta',
    phone: user?.phone || '9876543210',
    email: user?.email || 'user@agrimind.in',
    state: user?.state || 'Tamil Nadu',
    district: user?.district || 'Thanjavur',
    farmSize: user?.farmSize || '5.5',
    soilType: user?.soilType || 'alluvial',
    companyName: user?.companyName || 'Sri Lakshmi Rice Mill',
    gstNumber: user?.gstNumber || '33AAAAA0000A1Z5',
    deliveryAddress: user?.deliveryAddress || 'Plot 42, Anna Nagar West, Chennai',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const phoneErr = validatePhone(editForm.phone);
    if (phoneErr) {
      setPhoneError(phoneErr);
      return;
    }
    setPhoneError(null);

    setIsSaving(true);
    try {
      await updateProfile(editForm);
      setIsEditOpen(false);
      toast.success('Profile details updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.info('Logged out from AGRIMIND');
    navigate('/');
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8 select-none">
      {/* Top Banner with Role Identification */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg flex-shrink-0">
            {userRole === 'merchant' ? '🏢' : userRole === 'customer' ? '🛒' : '🌾'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                userRole === 'merchant'
                  ? 'bg-amber-400 text-slate-950'
                  : userRole === 'customer'
                  ? 'bg-sky-400 text-slate-950'
                  : 'bg-emerald-400 text-slate-950'
              }`}>
                {userRole === 'merchant'
                  ? '🏢 Verified Merchant / Miller'
                  : userRole === 'customer'
                  ? '🛒 Customer / Direct Buyer'
                  : '🌾 Verified Cultivator Farmer'}
              </span>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> ID Verified
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display mt-1">
              {user?.name || (userRole === 'merchant' ? editForm.companyName : 'Naresh Chinta')}
            </h1>
            <p className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
              <span>📍 {user?.district || 'Thanjavur'}, {user?.state || 'Tamil Nadu'}</span>
              <span>•</span>
              <span>📞 {user?.phone || '9876543210'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={Edit3}
            onClick={() => setIsEditOpen(true)}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Edit Profile
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={LogOut}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DASHBOARD 1: 🌾 FARMER DASHBOARD                                         */}
      {/* ========================================================================= */}
      {userRole === 'farmer' && (
        <div className="space-y-6">
          {/* Farm Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Farm Land Size</span>
              <div className="text-2xl font-black text-slate-900 font-display">
                {user?.farmSize || '5.5'} <span className="text-xs text-slate-500 font-normal">Acres</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-bold block">
                Soil: {user?.soilType ? user.soilType.toUpperCase() : 'ALLUVIAL LOAM'}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Active Crop</span>
              <div className="text-2xl font-black text-emerald-700 font-display">
                Paddy (Ponni)
              </div>
              <span className="text-[11px] text-slate-500 font-bold block">
                Harvest in ~35 Days
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Expected Harvest</span>
              <div className="text-2xl font-black text-slate-900 font-display">
                140 <span className="text-xs text-slate-500 font-normal">Quintals</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-bold block">
                Est. Value: ₹3,57,000
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Crop Health Index</span>
              <div className="text-2xl font-black text-emerald-600 font-display">
                98% <span className="text-xs text-emerald-700 font-bold">Optimal</span>
              </div>
              <span className="text-[11px] text-slate-500 block">0 Pests Detected</span>
            </div>
          </div>

          {/* Quick Farmer Operations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tool 1: AI Soil & Crop Test */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
                  🌱
                </div>
                <h3 className="text-lg font-black text-slate-900 font-display">
                  Soil Quality & Crop Advisory
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Scan your farm soil to check NPK, pH, and get recommended high-yield varieties.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSoilScannerOpen(true)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>Run Soil Check by Photo</span>
              </button>
            </div>

            {/* Tool 2: Live Mandi Price Watch & Sell Crop */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xl">
                  🛒
                </div>
                <h3 className="text-lg font-black text-slate-900 font-display">
                  Sell Harvest to Millers
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Broadcast your paddy, cotton, or vegetable harvest directly to 1,500+ verified buyers.
                </p>
              </div>
              <Link to="/marketplace">
                <button
                  type="button"
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Open Mandi & Buyer Network</span>
                </button>
              </Link>
            </div>

            {/* Tool 3: Precision Irrigation */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xl">
                  💧
                </div>
                <h3 className="text-lg font-black text-slate-900 font-display">
                  Smart Irrigation Schedule
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Next watering for Wheat/Paddy scheduled in <strong>2 Days (Morning 6:00 AM)</strong>.
                </p>
              </div>
              <Link to="/features?tab=water">
                <button
                  type="button"
                  className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <Droplets className="w-4 h-4" />
                  <span>View Water Schedule</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DASHBOARD 2: 🛒 CUSTOMER / DIRECT BUYER DASHBOARD                         */}
      {/* ========================================================================= */}
      {userRole === 'customer' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Active Orders</span>
              <div className="text-2xl font-black text-sky-700 font-display">
                2 Farm Shipments
              </div>
              <span className="text-[11px] text-slate-500 font-bold block">
                Expected Delivery Tomorrow
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Saved on Wholesale</span>
              <div className="text-2xl font-black text-emerald-600 font-display">
                ₹3,450
              </div>
              <span className="text-[11px] text-slate-500 block">Direct from Farmers (No Middlemen)</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Subscribed Local Farms</span>
              <div className="text-2xl font-black text-slate-900 font-display">
                4 Verified Farms
              </div>
              <span className="text-[11px] text-sky-700 font-bold block">Thanjavur & Coimbatore</span>
            </div>
          </div>

          {/* Customer Orders Table */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
                <Truck className="w-5 h-5 text-sky-600" />
                <span>Your Farm-Direct Orders</span>
              </h3>
              <Link to="/marketplace" className="text-xs font-bold text-sky-700 hover:underline">
                + Browse More Fresh Produce
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 bg-white rounded-xl shadow-sm">🌾</span>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      Organic Ponni Boiled Rice (25 kg Bag)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Farmer: K. Murugan • Thanjavur District
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-between sm:justify-end">
                  <span className="text-sm font-black text-slate-900">₹1,450</span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                    Out for Delivery 🚚
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 bg-white rounded-xl shadow-sm">🍅</span>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      Fresh Farm Country Tomatoes (10 kg Box)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Farmer: Ramesh Kumar • Salem APMC Farm
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-between sm:justify-end">
                  <span className="text-sm font-black text-slate-900">₹320</span>
                  <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2.5 py-1 rounded-full">
                    Packed at Farm 📦
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DASHBOARD 3: 🏢 MERCHANT / MILLER / TRADER DASHBOARD                      */}
      {/* ========================================================================= */}
      {userRole === 'merchant' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Season Procurement Target</span>
              <div className="text-2xl font-black text-slate-900 font-display">
                1,500 <span className="text-xs text-slate-500 font-normal">Tons</span>
              </div>
              <span className="text-[11px] text-amber-700 font-bold block">
                Target: Paddy & Wheat
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Procured So Far</span>
              <div className="text-2xl font-black text-emerald-700 font-display">
                840 Tons
              </div>
              <span className="text-[11px] text-slate-500 block">56% of Quota Complete</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Direct Farmer Network</span>
              <div className="text-2xl font-black text-slate-900 font-display">
                128 Farmers
              </div>
              <span className="text-[11px] text-emerald-700 font-bold block">Connected via AGRIMIND</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Pending Inquiries</span>
              <div className="text-2xl font-black text-amber-600 font-display">
                6 Deals
              </div>
              <span className="text-[11px] text-slate-500 block">Farmer WhatsApp Inquiries</span>
            </div>
          </div>

          {/* Incoming Farmer Offers */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-600" />
                <span>Live Harvest Offers from Farmers</span>
              </h3>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                ● 4 Active Offers Today
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 bg-white rounded-xl shadow-sm">🌾</span>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      BPT-5204 (Samba Mahsuri) Paddy — 150 Bags (11.2 Tons)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Farmer: S. Sundaram • Kumbakonam, Thanjavur • Moisture: 13.5%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-slate-900 mr-2">₹2,520/Qtl</span>
                  <a
                    href="tel:9842109876"
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-emerald-700"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Farmer</span>
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 bg-white rounded-xl shadow-sm">🌿</span>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      Bt Cotton (RCH 659) — 80 Quintals
                    </h4>
                    <p className="text-xs text-slate-500">
                      Farmer: G. Velusamy • Tirupur APMC Region
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-slate-900 mr-2">₹7,050/Qtl</span>
                  <a
                    href="tel:9842109876"
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-emerald-700"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Farmer</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Update Profile Details">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Name / Organization Name"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            required
          />

          <Input
            label="Mobile Number (10 Digits)"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={editForm.phone}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 10);
              setEditForm({ ...editForm, phone: val });
              if (phoneError) setPhoneError(null);
            }}
            helperText={editForm.phone ? `${editForm.phone.length}/10 digits` : '10-digit mobile number'}
            error={phoneError}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="State"
              options={INDIAN_STATES}
              value={editForm.state}
              onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
            />
            <Input
              label="District / Mandi"
              value={editForm.district}
              onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
            />
          </div>

          {userRole === 'farmer' && (
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Farm Size (Acres)"
                type="number"
                value={editForm.farmSize}
                onChange={(e) => setEditForm({ ...editForm, farmSize: e.target.value })}
              />
              <Select
                label="Soil Type"
                options={SOIL_TYPES.map((s) => ({ value: s.id, label: s.name.split('(')[0] }))}
                value={editForm.soilType}
                onChange={(e) => setEditForm({ ...editForm, soilType: e.target.value })}
              />
            </div>
          )}

          {userRole === 'merchant' && (
            <Input
              label="GST / APMC License"
              value={editForm.gstNumber}
              onChange={(e) => setEditForm({ ...editForm, gstNumber: e.target.value })}
            />
          )}

          {userRole === 'customer' && (
            <Input
              label="Delivery Address"
              value={editForm.deliveryAddress}
              onChange={(e) => setEditForm({ ...editForm, deliveryAddress: e.target.value })}
            />
          )}

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              Save Profile
            </Button>
          </div>
        </form>
      </Modal>

      {/* Soil Scanner Modal */}
      <SoilScannerModal
        isOpen={isSoilScannerOpen}
        onClose={() => setIsSoilScannerOpen(false)}
      />
    </div>
  );
};

export default ProfilePage;
