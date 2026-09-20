import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = 'Unable to reach the weather service. Please try again.',
  onRetry,
  isRetrying = false,
}) => {
  return (
    <div
      id="weather-service-error"
      role="alert"
      className="w-full p-5 sm:p-6 rounded-2xl bg-rose-50/80 border border-rose-200 text-rose-900 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      <div className="flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-rose-100 text-rose-600 shrink-0 mt-0.5">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-base text-rose-950">Connection Error</h3>
          <p className="text-sm text-rose-800 mt-0.5">{message}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white font-medium text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
      >
        <RotateCcw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
        <span>{isRetrying ? 'Retrying...' : 'Retry'}</span>
      </button>
    </div>
  );
};
