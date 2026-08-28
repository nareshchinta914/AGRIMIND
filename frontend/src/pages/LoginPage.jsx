import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  Building2,
  ShoppingCart,
  Sprout,
  AlertCircle
} from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import ErrorMessage from '../components/common/ErrorMessage';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useLanguage } from '../hooks/useLanguage';

const LoginPage = () => {
  const { login, getDashboardPath } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Selected Account Type: 'FARMER', 'CUSTOMER', or 'MERCHANT'
  const [accountType, setAccountType] = useState('FARMER');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [selectedRoleBadge, setSelectedRoleBadge] = useState(null);

  // Check if redirected from a protected page
  const redirectNotice = location.state?.requireLoginMsg;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setAuthError(null);

    const cleanId = identifier.trim();
    let idErr = null;
    if (!cleanId) {
      idErr = 'Please enter your Mobile Number or Email';
    } else if (cleanId.includes('@')) {
      if (!/\S+@\S+\.\S+/.test(cleanId)) {
        idErr = 'Please enter a valid Email address';
      }
    } else {
      const cleanPhone = cleanId.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        idErr = 'Mobile number must be exactly 10 digits';
      } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
        idErr = 'Mobile number must start with 6, 7, 8, or 9';
      }
    }

    let passErr = null;
    if (!password) {
      passErr = 'Password is required';
    }

    if (idErr || passErr) {
      setErrors({ identifier: idErr, password: passErr });
      return;
    }
    setErrors({});

    setIsLoading(true);
    try {
      const result = await login({ identifier: cleanId, password, role: accountType, rememberMe });
      const userRole = (result?.user?.role || accountType).toUpperCase();
      toast.success(`Login confirmed as ${userRole}! Welcome to AGRIMIND.`);
      
      // Redirect to the respective role's dashboard
      if (userRole === 'MERCHANT') {
        navigate('/merchant/dashboard', { replace: true });
      } else if (userRole === 'CUSTOMER') {
        navigate('/customer/dashboard', { replace: true });
      } else {
        navigate('/farmer/dashboard', { replace: true });
      }
    } catch (err) {
      setAuthError({
        type: 'general',
        title: 'Authentication Failed',
        message: err.message || 'Invalid account type for this account. Please verify your role and retry.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRoleCredentials = (roleType) => {
    setAuthError(null);
    setErrors({});
    setAccountType(roleType);
    if (roleType === 'FARMER') {
      setIdentifier('9876543210');
      setPassword('Kisan@2026!');
      setSelectedRoleBadge('🌾 Farmer Account Selected');
    } else if (roleType === 'CUSTOMER') {
      setIdentifier('customer@gmail.com');
      setPassword('Customer@2026!');
      setSelectedRoleBadge('🛒 Customer Account Selected');
    } else if (roleType === 'MERCHANT') {
      setIdentifier('merchant@ricemill.com');
      setPassword('Merchant@2026!');
      setSelectedRoleBadge('🏢 Merchant Account Selected');
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
          {t('login')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Enter your credentials and select your account type to log in
        </p>
      </div>

      {/* Security notice if direct access was blocked */}
      {redirectNotice && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>{redirectNotice}</span>
        </div>
      )}

      {authError && (
        <ErrorMessage
          type={authError.type}
          title={authError.title}
          message={authError.message}
        />
      )}

      {/* Active Selection Badge */}
      {selectedRoleBadge && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {selectedRoleBadge}
          </span>
          <span className="text-[10px] text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
            Click Confirm to Log In
          </span>
        </div>
      )}

      {/* Account Type Selector */}
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
          Select Account Type <span className="text-emerald-600">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => {
              setAccountType('FARMER');
              setAuthError(null);
            }}
            className={`p-3 rounded-2xl border-2 font-bold text-xs flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              accountType === 'FARMER'
                ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-500/30 shadow-sm'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Sprout className={`w-5 h-5 ${accountType === 'FARMER' ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>🌾 Farmer</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAccountType('CUSTOMER');
              setAuthError(null);
            }}
            className={`p-3 rounded-2xl border-2 font-bold text-xs flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              accountType === 'CUSTOMER'
                ? 'border-sky-600 bg-sky-50/80 text-sky-950 ring-2 ring-sky-500/30 shadow-sm'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ShoppingCart className={`w-5 h-5 ${accountType === 'CUSTOMER' ? 'text-sky-600' : 'text-slate-400'}`} />
            <span>🛒 Customer</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAccountType('MERCHANT');
              setAuthError(null);
            }}
            className={`p-3 rounded-2xl border-2 font-bold text-xs flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              accountType === 'MERCHANT'
                ? 'border-amber-600 bg-amber-50/80 text-amber-950 ring-2 ring-amber-500/30 shadow-sm'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Building2 className={`w-5 h-5 ${accountType === 'MERCHANT' ? 'text-amber-600' : 'text-slate-400'}`} />
            <span>🏪 Merchant</span>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t('mobileOrEmail')}
          type="text"
          required
          icon={identifier.includes('@') ? Mail : Phone}
          placeholder="10-digit mobile or email (e.g. 9876543210)"
          value={identifier}
          onChange={(e) => {
            const val = e.target.value;
            if (!val.includes('@') && /^\d+$/.test(val)) {
              setIdentifier(val.slice(0, 10));
            } else {
              setIdentifier(val);
            }
            if (errors.identifier) setErrors({ ...errors, identifier: null });
          }}
          error={errors.identifier}
        />

        <Input
          label={t('password')}
          type={showPassword ? 'text' : 'password'}
          required
          icon={Lock}
          placeholder="Enter your account password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
        />

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
            />
            <span>Remember Me</span>
          </label>

          <Link
            to="/forgot-password"
            className="font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          icon={LogIn}
          className="w-full text-base font-black shadow-xl shadow-emerald-600/30 mt-2"
        >
          Confirm & Log In as {accountType}
        </Button>
      </form>

      {/* Role Credentials Auto-Fill */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block text-center">
          1-Click Demo Accounts
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleSelectRoleCredentials('FARMER')}
            className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-900 text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer"
          >
            <Sprout className="w-4 h-4 text-emerald-700" />
            <span>🌾 Farmer Demo</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectRoleCredentials('CUSTOMER')}
            className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 hover:bg-sky-100 text-sky-900 text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 text-sky-700" />
            <span>🛒 Customer Demo</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectRoleCredentials('MERCHANT')}
            className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-900 text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-amber-700" />
            <span>🏪 Merchant Demo</span>
          </button>
        </div>
      </div>

      {/* Footer link to Signup */}
      <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-600">
        Don't have an account?{' '}
        <Link to="/register" className="font-black text-emerald-700 hover:text-emerald-800">
          {t('signup')}
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
