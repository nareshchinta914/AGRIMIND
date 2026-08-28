const { z } = require('zod');

const strongPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter (A-Z)')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter (a-z)')
  .regex(/[0-9]/, 'Password must contain at least one number (0-9)')
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/, 'Password must contain at least one special character (!@#$%^&*)');

const mobileNumberSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, 'Mobile number must be exactly 10 digits starting with 6, 7, 8, or 9');

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  mobileNumber: mobileNumberSchema,
  email: z.string().optional().nullable().refine(
    (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    'Please enter a valid email address'
  ),
  password: strongPasswordSchema,
  role: z.enum(['FARMER', 'CUSTOMER', 'MERCHANT', 'ADMIN']),
  preferredLanguage: z.string().default('en').optional(),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  // Role specific optional fields
  village: z.string().optional().nullable(),
  farmSize: z.union([z.number(), z.string()]).optional().nullable(),
  farmSizeUnit: z.string().optional().nullable(),
  soilType: z.string().optional().nullable(),
  currentCrop: z.string().optional().nullable(),
  currentCrops: z.string().optional().nullable(),
  deliveryAddress: z.string().optional().nullable(),
  businessName: z.string().optional().nullable(),
  businessType: z.string().optional().nullable(),
  businessAddress: z.string().optional().nullable(),
  gstNumber: z.string().optional().nullable(),
  confirmPassword: z.string().optional().nullable()
});

const loginSchema = z.object({
  identifier: z.string().min(1, 'Mobile number or Email is required'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['FARMER', 'CUSTOMER', 'MERCHANT', 'ADMIN', 'farmer', 'customer', 'merchant', 'admin']).optional().nullable()
});

const forgotPasswordSchema = z.object({
  identifier: z.string().min(1, 'Mobile number or Email is required')
});

const resetPasswordSchema = z.object({
  token: z.string().optional().nullable(),
  otp: z.string().optional().nullable(),
  identifier: z.string().optional().nullable(),
  newPassword: strongPasswordSchema
});

module.exports = {
  strongPasswordSchema,
  mobileNumberSchema,
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
};


