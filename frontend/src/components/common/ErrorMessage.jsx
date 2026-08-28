import React from 'react';
import { AlertTriangle, WifiOff, RefreshCw, Lock, ServerCrash } from 'lucide-react';
import Button from './Button';

const ErrorMessage = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while fetching farm records.',
  type = 'general', // general | offline | network | unauthorized | server
  onRetry,
  className = '',
}) => {
  const getIcon = () => {
    switch (type) {
      case 'offline':
      case 'network':
        return <WifiOff className="w-8 h-8 text-amber-600" />;
      case 'unauthorized':
        return <Lock className="w-8 h-8 text-red-600" />;
      case 'server':
        return <ServerCrash className="w-8 h-8 text-red-600" />;
      default:
        return <AlertTriangle className="w-8 h-8 text-amber-600" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'unauthorized':
      case 'server':
        return 'border-red-200 bg-red-50/50';
      case 'offline':
      case 'network':
        return 'border-amber-200 bg-amber-50/50';
      default:
        return 'border-slate-200 bg-slate-50/70';
    }
  };

  return (
    <div
      className={`w-full rounded-2xl border p-6 text-center flex flex-col items-center justify-center gap-3 ${getBorderColor()} ${className}`}
    >
      <div className="p-3 bg-white rounded-full shadow-sm border border-slate-100">{getIcon()}</div>

      <div>
        <h4 className="text-lg font-bold text-slate-800 font-display">{title}</h4>
        <p className="text-sm text-slate-600 max-w-md mx-auto mt-1">{message}</p>
      </div>

      {onRetry && (
        <div className="mt-2">
          <Button variant="outline" size="sm" onClick={onRetry} icon={RefreshCw}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;
