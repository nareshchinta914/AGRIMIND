import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-agri-600 hover:bg-agri-700 active:bg-agri-800 text-white shadow-lg shadow-agri-600/25 border border-agri-500/30',
  secondary: 'bg-skyAgri-600 hover:bg-skyAgri-700 active:bg-skyAgri-800 text-white shadow-md shadow-skyAgri-600/20 border border-skyAgri-500/30',
  amber: 'bg-sunAmber-500 hover:bg-sunAmber-600 active:bg-sunAmber-700 text-slate-900 font-semibold shadow-md shadow-sunAmber-500/20 border border-sunAmber-400',
  outline: 'bg-transparent border-2 border-agri-600 text-agri-700 hover:bg-agri-50 active:bg-agri-100 dark:border-agri-500 dark:text-agri-400',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200 dark:text-slate-200',
  danger: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-md shadow-red-600/20',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5 min-h-[36px]',
  md: 'px-4 py-2 text-sm font-semibold rounded-xl gap-2 min-h-[44px]',
  lg: 'px-6 py-3 text-base font-bold rounded-xl gap-2.5 min-h-[52px]',
  xl: 'px-8 py-4 text-lg font-bold rounded-2xl gap-3 min-h-[60px]',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconRight: IconRight,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const variantStyles = variants[variant] || variants.primary;
  const sizeStyles = sizes[size] || sizes.md;

  return (
    <motion.button
      whileHover={disabled || isLoading ? {} : { scale: 1.02 }}
      whileTap={disabled || isLoading ? {} : { scale: 0.97 }}
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`inline-flex items-center justify-center transition-all duration-200 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
          <span>{children}</span>
          {IconRight && <IconRight className="w-5 h-5 flex-shrink-0" />}
        </>
      )}
    </motion.button>
  );
};

export default Button;
