import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, RefreshCw, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import ErrorMessage from '../components/common/ErrorMessage';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { useToast } from '../hooks/useToast';
import { validateOtp } from '../utils/validators';

const VerifyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyAccount } = useAuth();
  const { toast } = useToast();

  const phone = location.state?.phone || '9876543210';
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(45);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const otpErr = validateOtp(otp);
    if (otpErr) {
      setError(otpErr);
      return;
    }

    setIsLoading(true);
    try {
      await verifyAccount({ phone, otp });
      toast.success('Mobile number verified successfully! Welcome to AGRIMIND.');
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setIsResending(true);
    try {
      await authService.resendOtp({ phone });
      setTimer(60);
      toast.success('New OTP sent via SMS!');
    } catch (err) {
      toast.error('Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
          Verify Farmer Account
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          We have sent a 6-digit verification code via SMS to{' '}
          <strong className="text-slate-800">+91 {phone}</strong>
        </p>
      </div>

      {error && (
        <ErrorMessage
          type="general"
          title="Verification Error"
          message={error}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center">
          <Input
            label="Enter 6-Digit OTP Code"
            type="text"
            maxLength={6}
            required
            placeholder="e.g. 123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            className="text-center text-2xl font-black tracking-widest text-slate-900"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Tip: For testing, you can enter any 6 digits (e.g. 123456)
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          icon={CheckCircle2}
          className="w-full text-base font-bold shadow-xl shadow-agri-600/30"
        >
          Verify & Continue
        </Button>
      </form>

      {/* Resend Timer */}
      <div className="text-center pt-2 text-xs text-slate-600">
        {timer > 0 ? (
          <p>
            Resend OTP in <span className="font-bold text-agri-700">{timer} seconds</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="font-bold text-agri-700 hover:text-agri-800 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
            <span>Resend OTP SMS</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyPage;
