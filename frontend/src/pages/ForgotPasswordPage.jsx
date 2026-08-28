import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Mail, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import ErrorMessage from '../components/common/ErrorMessage';
import { authService } from '../services/authService';
import { useToast } from '../hooks/useToast';

const ForgotPasswordPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clean = identifier.trim();
    if (!clean) {
      setError('Please enter your registered Mobile Number or Email');
      return;
    }

    if (clean.includes('@')) {
      if (!/\S+@\S+\.\S+/.test(clean)) {
        setError('Please enter a valid email address');
        return;
      }
    } else {
      const cleanPhone = clean.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        setError('Mobile number must be exactly 10 digits');
        return;
      }
      if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
        setError('Mobile number must start with 6, 7, 8, or 9');
        return;
      }
    }

    setError(null);

    setIsLoading(true);
    try {
      await authService.forgotPassword({ identifier: clean });
      toast.success('Password reset instructions sent!');
      navigate('/reset-password', { state: { identifier: clean } });
    } catch (err) {
      setError(err.message || 'Failed to send recovery code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
          Forgot Password
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Enter your registered Mobile Number or Email to receive a recovery code
        </p>
      </div>

      {error && (
        <ErrorMessage
          type="general"
          title="Recovery Error"
          message={error}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Registered Mobile Number or Email"
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
            if (error) setError(null);
          }}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          iconRight={ArrowRight}
          className="w-full text-base font-black shadow-xl shadow-emerald-600/30"
        >
          Send Recovery Code
        </Button>
      </form>

      <div className="text-center pt-4 border-t border-slate-100 text-xs">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Login</span>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
