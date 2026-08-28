import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Lock, KeyRound, CheckCircle2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import ErrorMessage from '../components/common/ErrorMessage';
import PasswordStrengthIndicator from '../components/common/PasswordStrengthIndicator';
import { authService } from '../services/authService';
import { useToast } from '../hooks/useToast';
import { validatePassword, validateOtp } from '../utils/validators';

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const identifier = location.state?.identifier || 'your phone/email';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    const otpErr = validateOtp(otp);
    const passErr = validatePassword(newPassword);
    let confirmErr = null;
    if (newPassword !== confirmPassword) {
      confirmErr = 'Passwords do not match';
    }

    if (otpErr || passErr || confirmErr) {
      setErrors({ otp: otpErr, newPassword: passErr, confirmPassword: confirmErr });
      return;
    }
    setErrors({});

    setIsLoading(true);
    try {
      await authService.resetPassword({ identifier, otp, newPassword });
      toast.success('Password updated successfully! Please login with your new password.');
      navigate('/login');
    } catch (err) {
      setServerError(err.message || 'Invalid OTP code or expired token.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
          Reset Password
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Enter the 6-digit OTP sent to <strong className="text-slate-700">{identifier}</strong> and create a strong new password
        </p>
      </div>

      {serverError && (
        <ErrorMessage
          type="general"
          title="Reset Error"
          message={serverError}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="6-Digit OTP Code"
          type="tel"
          inputMode="numeric"
          maxLength={6}
          required
          icon={KeyRound}
          placeholder="e.g. 123456"
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
            if (errors.otp) setErrors({ ...errors, otp: null });
          }}
          helperText={otp ? `${otp.length}/6 digits` : 'Enter the 6-digit verification code'}
          error={errors.otp}
        />

        <div className="space-y-3">
          <Input
            label="New Strong Password"
            type={showPassword ? 'text' : 'password'}
            required
            icon={Lock}
            placeholder="Min. 8 chars, A-Z, a-z, 0-9, @#$"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (errors.newPassword) setErrors({ ...errors, newPassword: null });
            }}
            error={errors.newPassword}
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

          <PasswordStrengthIndicator password={newPassword} />
        </div>

        <Input
          label="Confirm New Password"
          type={showPassword ? 'text' : 'password'}
          required
          icon={Lock}
          placeholder="Repeat new password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
          }}
          error={errors.confirmPassword}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          icon={CheckCircle2}
          className="w-full text-base font-bold shadow-xl shadow-agri-600/30"
        >
          Set New Password
        </Button>
      </form>

      <div className="text-center pt-4 border-t border-slate-100 text-xs">
        <Link to="/login" className="font-bold text-agri-700 hover:text-agri-800">
          Return to Login
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

