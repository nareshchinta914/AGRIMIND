import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Edit3,
  Check,
  Save,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Receipt,
  Truck,
  Package,
  Store,
  Scale
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../../hooks/useToast';
import { orderService } from '../../services/orderService';
import { INDIAN_STATES, DISTRICT_MAP } from '../../utils/constants';
import { validatePhone } from '../../utils/validators';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';

const MerchantProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { language, languages, setLanguage } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [phoneError, setPhoneError] = useState(null);
  const [cart, setCart] = useState(orderService.getCart());

  const [formData, setFormData] = useState({
    businessName: user?.businessName || user?.fullName || user?.name || 'Merchant Enterprise',
    name: user?.fullName || user?.name || 'Managing Partner',
    phone: user?.mobileNumber || user?.phone || '',
    email: user?.email || '',
    state: user?.state || 'Tamil Nadu',
    district: user?.district || 'Thanjavur',
    businessAddress: user?.businessAddress || '',
    gstNumber: user?.gstNumber || '',
    apmcLicense: user?.apmcLicense || 'APMC-TN-THANJ-TR-2024-512',
    businessType: user?.businessType || 'Grain Miller & Wholesale Trader',
    preferredLanguage: user?.preferredLanguage || language || 'en'
  });

  // Keep cart in sync
  useEffect(() => {
    const syncCart = () => {
      setCart(orderService.getCart());
    };
    window.addEventListener('storage', syncCart);
    return () => window.removeEventListener('storage', syncCart);
  }, []);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        businessName: user.businessName || user.fullName || user.name || prev.businessName,
        name: user.fullName || user.name || prev.name,
        phone: user.mobileNumber || user.phone || prev.phone,
        email: user.email || prev.email,
        state: user.state || prev.state,
        district: user.district || prev.district,
        businessAddress: user.businessAddress || prev.businessAddress,
        gstNumber: user.gstNumber || prev.gstNumber,
        apmcLicense: user.apmcLicense || prev.apmcLicense,
        businessType: user.businessType || prev.businessType,
        preferredLanguage: user.preferredLanguage || language || prev.preferredLanguage
      }));
    }
  }, [user, language]);

  const availableDistricts = DISTRICT_MAP[formData.state] || ['Thanjavur', 'Madurai', 'Coimbatore'];

  // Commercial & Wholesale Cart Amount Calculations (Zero Confusion)
  const totalItemCount = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1), 0);
  const apmcCess = subtotal > 0 ? Math.round(subtotal * 0.01) : 0; // 1% APMC Mandi Cess
  const freightFee = subtotal === 0 ? 0 : subtotal > 10000 ? 0 : 150;
  const totalAmount = subtotal + apmcCess + freightFee;

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty < 1) {
      handleRemoveItem(productId);
      return;
    }
    const updated = orderService.updateCartQuantity(productId, newQty);
    setCart([...updated]);
  };

  const handleRemoveItem = (productId) => {
    const updated = orderService.removeFromCart(productId);
    setCart([...updated]);
    toast.info('Procurement item removed');
  };

  const handleAddSampleItem = (sample) => {
    const updated = orderService.addToCart(sample, 5);
    setCart([...updated]);
    toast.success(`Added 5x ${sample.name} to procurement cart!`);
  };

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
      toast.success('Merchant profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  // Sample wholesale commodities
  const sampleCommodities = [
    {
      id: 'prod_1',
      name: 'Organic Traditional Ponni Paddy',
      price: 2450,
      unit: 'Bag (75kg)',
      sellerName: 'K. Murugan (Farmer)',
      sellerRole: 'FARMER',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'prod_3',
      name: 'Premium Sharbati Wheat Grain',
      price: 2850,
      unit: 'Quintal (100kg)',
      sellerName: 'Baldev Singh (Farmer)',
      sellerRole: 'FARMER',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className="space-y-6 select-none max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-black text-3xl shadow-lg flex-shrink-0">
            🏢
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full">
                Account Type: MERCHANT
              </span>
              <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> APMC & GST Licensed
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display mt-1">
              {formData.businessName}
            </h2>
            <p className="text-xs text-slate-400">
              📍 {formData.district}, {formData.state} • {formData.businessType}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all border border-white/10 cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-amber-400" />
            <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
          </button>

          <Link
            to="/customer/cart"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all shadow-md cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Procurement Cart ({totalItemCount})</span>
          </Link>
        </div>
      </div>

      {/* 🏢 BULK PROCUREMENT CART & AMOUNT CALCULATION SECTION */}
      <div className="bg-white p-6 rounded-3xl border-2 border-amber-200/80 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <Scale className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-black text-slate-900 font-display">
                  Bulk Procurement Cart & Trade Calculations
                </h3>
                <p className="text-xs text-slate-500">
                  Direct agricultural commodity procurement from verified farmers
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full">
              {totalItemCount} {totalItemCount === 1 ? 'Lot' : 'Lots / Units'} Selected
            </span>
            <Link
              to="/customer/products"
              className="text-xs font-bold text-amber-800 hover:text-amber-900 hover:underline flex items-center gap-1"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Explore Farm Lots</span>
            </Link>
          </div>
        </div>

        {cart.length === 0 ? (
          /* Empty Procurement Cart */
          <div className="text-center py-8 space-y-4 bg-slate-50 rounded-2xl p-6 border border-dashed border-slate-300">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-xl font-black">
              🏢
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-800">No procurement lots in cart</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Select bulk crops and commodities directly from verified regional farmers to view wholesale rate calculations.
              </p>
            </div>

            <div className="pt-2">
              <span className="text-xs font-bold text-slate-400 block mb-2">1-Click Quick Add Bulk Commodities:</span>
              <div className="flex flex-wrap justify-center gap-2">
                {sampleCommodities.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleAddSampleItem(c)}
                    className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-amber-500 hover:bg-amber-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-600" />
                    <span>+ Add 5x {c.name} (₹{c.price.toLocaleString('en-IN')})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Procurement Cart Items Table */
          <div className="space-y-4">
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
              {cart.map((item) => {
                const itemTotal = (item.product?.price || 0) * (item.quantity || 1);
                return (
                  <div
                    key={item.product?.id || Math.random()}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {item.product?.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-sm flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl font-bold flex-shrink-0">
                          🌾
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                          {item.product?.name || 'Wholesale Commodity'}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>₹{item.product?.price?.toLocaleString('en-IN')} / {item.product?.unit || 'unit'}</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-semibold">{item.product?.sellerName || 'Direct Farmer'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Selector & Calculation */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      {/* +/- Control */}
                      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.product?.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer"
                          title="Decrease Quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-black text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.product?.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer"
                          title="Increase Quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line Item Calculation Formula */}
                      <div className="text-right min-w-[110px]">
                        <span className="text-[10px] text-slate-400 block">
                          {item.quantity} × ₹{item.product?.price?.toLocaleString('en-IN')}
                        </span>
                        <span className="text-sm font-black text-slate-900">
                          = ₹{itemTotal.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.product?.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                        title="Remove commodity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 💰 COMMERCIAL WHOLESALE AMOUNT BREAKDOWN */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-5 rounded-2xl shadow-lg space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Receipt className="w-4 h-4" />
                  <span>Wholesale Procurement Calculation</span>
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {totalItemCount} Units in Procurement Lot
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Commodities Gross Subtotal:</span>
                  <span className="font-bold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>APMC Mandi Market Cess (1% Standard):</span>
                  <span className="font-bold text-white">₹{apmcCess.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Mandi Freight & Loading:</span>
                  </span>
                  <span className={`font-bold ${freightFee === 0 ? 'text-emerald-400' : 'text-white'}`}>
                    {freightFee === 0 ? 'FREE (Wholesale Orders above ₹10,000)' : `₹${freightFee}`}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Procurement Payable</span>
                  <span className="text-2xl font-black text-amber-400 font-display">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/customer/products"
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all cursor-pointer"
                  >
                    + Add Lots
                  </Link>
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={() => navigate('/customer/cart')}
                    iconRight={ArrowRight}
                    className="font-black bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-400/20"
                  >
                    Place Trade Order
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form Details */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-600" />
            <span>Business Enterprise & Legal Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Business Enterprise Name"
              value={formData.businessName}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              icon={Building2}
              required
            />

            <Input
              label="Contact Person / Manager Name"
              value={formData.name}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              label="Business Email Address"
              value={formData.email}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              icon={Mail}
              type="email"
            />

            <Input
              label="Business Type / Category"
              value={formData.businessType}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
            />

            <Input
              label="GSTIN Number"
              value={formData.gstNumber}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
              placeholder="33AAAAA0000A1Z5"
            />

            <Input
              label="APMC License / Mandi Trader ID"
              value={formData.apmcLicense || ''}
              disabled={!isEditing}
              onChange={(e) => setFormData({ ...formData, apmcLicense: e.target.value })}
              placeholder="APMC-TN-THANJ-TR-2024-512"
            />
          </div>
        </div>

        {/* Location & Mandi Address */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-600" />
            <span>Enterprise Location & Mandi Yard</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>

          <Input
            label="Complete Business Address / Mandi Yard Plot"
            value={formData.businessAddress}
            disabled={!isEditing}
            onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
            placeholder="Plot No, Mandi Complex, Road"
          />
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

export default MerchantProfilePage;
