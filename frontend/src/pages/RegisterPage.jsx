import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Sprout,
  Building2,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import ErrorMessage from '../components/common/ErrorMessage';
import PasswordStrengthIndicator from '../components/common/PasswordStrengthIndicator';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useLanguage } from '../hooks/useLanguage';
import { INDIAN_STATES, DISTRICT_MAP, SOIL_TYPES } from '../utils/constants';
import { validatePhone, validatePassword, validateName } from '../utils/validators';

const RegisterPage = () => {
  const { register } = useAuth();
  const { toast } = useToast();
  const { language, languages, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  // Selected Profile Role: 'FARMER', 'CUSTOMER', or 'MERCHANT'
  const [accountType, setAccountType] = useState('FARMER');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferredLanguage: language,
    state: 'Tamil Nadu',
    district: 'Thanjavur',
    // Farmer fields
    village: '',
    farmSize: '5.0',
    farmSizeUnit: 'Acres',
    soilType: 'alluvial',
    currentCrop: 'Paddy',
    // Customer fields
    deliveryAddress: '',
    // Merchant fields
    businessName: '',
    businessType: 'Wholesaler & Miller',
    businessAddress: '',
    gstNumber: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const availableDistricts = DISTRICT_MAP[formData.state] || ['Central District', 'North District'];

  // Role selection cards
  const roleSuggestions = [
    {
      id: 'FARMER',
      title: '🌾 FARMER',
      subtitle: t('customerFarmer'),
      tag: 'Grow smarter & manage your farm',
      icon: Sprout,
      desc: 'Sell crops directly at live mandi rates, get AI disease diagnosis, soil check & water advisory.'
    },
    {
      id: 'CUSTOMER',
      title: '🛒 CUSTOMER',
      subtitle: t('customerBuyer'),
      tag: 'Buy fresh produce directly',
      icon: ShoppingCart,
      desc: 'Buy farm-fresh organic crops, vegetables, pulses & grains directly from verified local farmers.'
    },
    {
      id: 'MERCHANT',
      title: '🏢 MERCHANT',
      subtitle: t('merchantTrader'),
      tag: 'Procure & trade commodities',
      icon: Building2,
      desc: 'Procure bulk agricultural commodities, post live purchasing bids & trade with verified farmers.'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    const nameToValidate = accountType === 'MERCHANT' ? (formData.businessName || formData.fullName) : formData.fullName;
    const nameErr = validateName(nameToValidate);
    const phoneErr = validatePhone(formData.mobileNumber);
    const passErr = validatePassword(formData.password);
    let confirmErr = null;
    if (formData.password !== formData.confirmPassword) {
      confirmErr = 'Passwords do not match';
    }

    if (nameErr || phoneErr || passErr || confirmErr) {
      setErrors({
        fullName: nameErr,
        mobileNumber: phoneErr,
        password: passErr,
        confirmPassword: confirmErr,
      });
      return;
    }
    setErrors({});

    setIsLoading(true);
    try {
      const result = await register({
        ...formData,
        role: accountType,
        fullName: accountType === 'MERCHANT' ? (formData.businessName || formData.fullName) : formData.fullName,
      });
      const userRole = (result?.user?.role || accountType).toUpperCase();
      toast.success(`Account created as ${userRole}! Welcome to AGRIMIND.`);
      
      if (userRole === 'MERCHANT') {
        navigate('/merchant/dashboard', { replace: true });
      } else if (userRole === 'CUSTOMER') {
        navigate('/customer/dashboard', { replace: true });
      } else {
        navigate('/farmer/dashboard', { replace: true });
      }
    } catch (err) {
      setServerError(err.message || 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <span className="text-[11px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
          ✨ {t('signup')}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display mt-2">
          How do you want to use AGRIMIND?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Choose your account type below to get started.
        </p>
      </div>

      {/* 3 Large Role Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {roleSuggestions.map((role) => {
          const isSelected = accountType === role.id;
          const Icon = role.icon;
          return (
            <div
              key={role.id}
              onClick={() => setAccountType(role.id)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 text-left ${
                isSelected
                  ? 'border-emerald-600 bg-white shadow-lg ring-2 ring-emerald-500/30'
                  : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/80'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 font-display">
                    {role.title}
                  </h4>
                  <span className="text-xs font-bold text-emerald-700">
                    {role.subtitle}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-tight">
                  {role.desc}
                </p>
              </div>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md w-fit ${
                isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {role.tag}
              </span>
            </div>
          );
        })}
      </div>

      {serverError && (
        <ErrorMessage
          type="general"
          title="Signup Error"
          message={serverError}
        />
      )}

      {/* Form Fields Based on Role */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50 p-5 rounded-3xl border border-slate-200 shadow-sm">
        <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sunAmber-500" />
          <span>Registration Details: {accountType}</span>
        </h4>

        {/* 1. FARMER PROFILE FIELDS */}
        {accountType === 'FARMER' && (
          <>
            <Input
              label={t('fullName')}
              required
              icon={User}
              placeholder="e.g. Ramesh Kumar"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              error={errors.fullName}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Mobile Number (10 Digits)"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                required
                icon={Phone}
                placeholder="10-digit mobile (e.g. 9876543210)"
                value={formData.mobileNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setFormData({ ...formData, mobileNumber: val });
                  if (errors.mobileNumber) setErrors({ ...errors, mobileNumber: null });
                }}
                helperText={formData.mobileNumber ? `${formData.mobileNumber.length}/10 digits` : 'Enter 10-digit Indian mobile number'}
                error={errors.mobileNumber}
              />

              <Input
                label="Email (Optional)"
                type="email"
                icon={Mail}
                placeholder="farmer@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select
                label={t('state')}
                options={INDIAN_STATES}
                value={formData.state}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    state: e.target.value,
                    district: DISTRICT_MAP[e.target.value]?.[0] || 'District Headquarter',
                  })
                }
              />

              <Select
                label={t('district')}
                options={availableDistricts}
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              />

              <Input
                label={t('village')}
                placeholder="e.g. Papanasam"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label={t('farmSize')}
                type="number"
                min="0.5"
                step="0.5"
                placeholder="5.0"
                value={formData.farmSize}
                onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
              />

              <Select
                label="Unit"
                options={['Acres', 'Hectares', 'Bigha', 'Guntha']}
                value={formData.farmSizeUnit}
                onChange={(e) => setFormData({ ...formData, farmSizeUnit: e.target.value })}
              />

              <Select
                label={t('soilType')}
                options={SOIL_TYPES.map((s) => ({ value: s.id, label: s.name.split('(')[0] }))}
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
              />
            </div>

            <Input
              label={t('currentCrop')}
              placeholder="e.g. Paddy / Wheat / Cotton"
              value={formData.currentCrop}
              onChange={(e) => setFormData({ ...formData, currentCrop: e.target.value })}
            />
          </>
        )}

        {/* 2. CUSTOMER / CONSUMER PROFILE FIELDS */}
        {accountType === 'CUSTOMER' && (
          <>
            <Input
              label={t('fullName')}
              required
              icon={User}
              placeholder="e.g. Ananya Sharma"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              error={errors.fullName}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Mobile Number (10 Digits)"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                required
                icon={Phone}
                placeholder="10-digit mobile (e.g. 9840123456)"
                value={formData.mobileNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setFormData({ ...formData, mobileNumber: val });
                  if (errors.mobileNumber) setErrors({ ...errors, mobileNumber: null });
                }}
                helperText={formData.mobileNumber ? `${formData.mobileNumber.length}/10 digits` : 'Enter 10-digit Indian mobile number'}
                error={errors.mobileNumber}
              />

              <Input
                label="Email"
                type="email"
                icon={Mail}
                placeholder="buyer@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Select
                label={t('state')}
                options={INDIAN_STATES}
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
              <Input
                label={t('district')}
                placeholder="e.g. Chennai"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              />
            </div>

            <Input
              label={t('deliveryAddress')}
              placeholder="Door No, Street Name, Area"
              value={formData.deliveryAddress}
              onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
            />
          </>
        )}

        {/* 3. MERCHANT / MILLER PROFILE FIELDS */}
        {accountType === 'MERCHANT' && (
          <>
            <Input
              label={t('businessName')}
              required
              icon={Building2}
              placeholder="e.g. Sri Lakshmi Modern Rice Mill"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              error={errors.fullName}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label={t('fullName')}
                icon={User}
                placeholder="Contact Person Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />

              <Input
                label={t('businessType')}
                placeholder="e.g. Wholesaler / Miller / Exporter"
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Mobile Number (10 Digits)"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                required
                icon={Phone}
                placeholder="10-digit mobile (e.g. 9842109876)"
                value={formData.mobileNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setFormData({ ...formData, mobileNumber: val });
                  if (errors.mobileNumber) setErrors({ ...errors, mobileNumber: null });
                }}
                helperText={formData.mobileNumber ? `${formData.mobileNumber.length}/10 digits` : 'Enter 10-digit Indian mobile number'}
                error={errors.mobileNumber}
              />

              <Input
                label="GST Number (Optional)"
                placeholder="33AAAAA0000A1Z5"
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Select
                label={t('state')}
                options={INDIAN_STATES}
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
              <Select
                label={t('district')}
                options={availableDistricts}
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              />
            </div>

            <Input
              label="Business Address"
              placeholder="APMC Mandi Yard, Plot No."
              value={formData.businessAddress}
              onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
            />
          </>
        )}

        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label={t('password')}
              type={showPassword ? 'text' : 'password'}
              required
              icon={Lock}
              placeholder="Min. 8 chars, A-Z, a-z, 0-9, @#$"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              error={errors.password}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
            />

            <Input
              label={t('confirmPassword')}
              type={showPassword ? 'text' : 'password'}
              required
              icon={Lock}
              placeholder="Repeat password"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
              }}
              error={errors.confirmPassword}
            />
          </div>

          <PasswordStrengthIndicator password={formData.password} />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          iconRight={ArrowRight}
          className="w-full text-base font-black shadow-xl shadow-emerald-600/30 mt-2"
        >
          {t('createAccount')}
        </Button>
      </form>

      {/* Footer link to Login */}
      <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-600">
        Already registered?{' '}
        <Link to="/login" className="font-bold text-emerald-700 hover:text-emerald-800">
          {t('login')}
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
