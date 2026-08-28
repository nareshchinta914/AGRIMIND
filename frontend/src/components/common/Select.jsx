import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(({
  label,
  options = [],
  error,
  helperText,
  icon: Icon,
  className = '',
  containerClassName = '',
  required = false,
  placeholder = 'Select an option',
  id,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-semibold text-slate-700 flex items-center justify-between"
        >
          <span>
            {label} {required && <span className="text-red-500 font-bold">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Icon className="w-5 h-5" />
          </div>
        )}

        <select
          ref={ref}
          id={selectId}
          required={required}
          className={`w-full appearance-none rounded-xl border bg-white px-4 py-3 text-base text-slate-900 transition-all duration-200 focus:outline-none min-h-[48px] cursor-pointer ${
            Icon ? 'pl-11' : 'pl-4'
          } pr-10 ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
              : 'border-slate-300 hover:border-slate-400 focus:border-agri-600 focus:ring-4 focus:ring-agri-100'
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const value = typeof opt === 'object' ? opt.value || opt.id : opt;
            const labelText = typeof opt === 'object' ? opt.label || opt.name : opt;
            return (
              <option key={value} value={value}>
                {labelText}
              </option>
            );
          })}
        </select>

        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>

      {error ? (
        <p className="text-xs font-medium text-red-600 flex items-center gap-1 mt-0.5">
          <span>⚠️</span> {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
