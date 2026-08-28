// Form field validators

export const validatePhone = (phone) => {
  if (!phone) return 'Mobile number is required';
  const cleanPhone = String(phone).replace(/\D/g, '');
  if (cleanPhone.length !== 10) {
    return 'Mobile number must be exactly 10 digits';
  }
  if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
    return 'Mobile number must start with 6, 7, 8, or 9';
  }
  return null;
};

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter (A-Z)';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter (a-z)';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number (0-9)';
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
    return 'Password must contain at least one special character (!@#$%^&*)';
  }
  return null;
};

export const getPasswordStrength = (password = '') => {
  const checks = [
    { id: 'length', label: 'At least 8 characters', met: password.length >= 8 },
    { id: 'uppercase', label: 'One uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
    { id: 'lowercase', label: 'One lowercase letter (a-z)', met: /[a-z]/.test(password) },
    { id: 'number', label: 'One number (0-9)', met: /[0-9]/.test(password) },
    { id: 'special', label: 'One special symbol (!@#$...)', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password) }
  ];

  const passedCount = checks.filter((c) => c.met).length;
  const isStrong = passedCount === checks.length;

  let strengthLabel = 'Very Weak';
  let barColor = 'bg-red-500';
  let textColor = 'text-red-600';
  let progressPercent = 0;

  if (password.length > 0) {
    if (passedCount <= 1) {
      strengthLabel = 'Very Weak';
      barColor = 'bg-red-500';
      textColor = 'text-red-600';
      progressPercent = 20;
    } else if (passedCount === 2) {
      strengthLabel = 'Weak';
      barColor = 'bg-orange-500';
      textColor = 'text-orange-600';
      progressPercent = 40;
    } else if (passedCount === 3) {
      strengthLabel = 'Fair';
      barColor = 'bg-amber-500';
      textColor = 'text-amber-600';
      progressPercent = 60;
    } else if (passedCount === 4) {
      strengthLabel = 'Good';
      barColor = 'bg-sky-500';
      textColor = 'text-sky-600';
      progressPercent = 80;
    } else if (passedCount === 5) {
      strengthLabel = 'Strong';
      barColor = 'bg-emerald-500';
      textColor = 'text-emerald-600';
      progressPercent = 100;
    }
  }

  return {
    checks,
    passedCount,
    totalChecks: checks.length,
    isStrong,
    strengthLabel,
    barColor,
    textColor,
    progressPercent
  };
};

export const validateName = (name) => {
  if (!name || name.trim().length < 2) {
    return 'Please enter your full name (minimum 2 characters)';
  }
  return null;
};

export const validateOtp = (otp) => {
  if (!otp || String(otp).length !== 6 || !/^\d{6}$/.test(String(otp))) {
    return 'Please enter a valid 6-digit OTP code';
  }
  return null;
};

