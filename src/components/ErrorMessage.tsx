import React from 'react';
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  const isNetworkError = message.toLowerCase().includes('network') || 
                         message.toLowerCase().includes('timeout') || 
                         message.toLowerCase().includes('connection');

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          {isNetworkError ? (
            <WifiOff className="h-12 w-12 text-red-500" />
          ) : (
            <AlertTriangle className="h-12 w-12 text-red-500" />
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
          {isNetworkError ? 'Connection Problem' : 'Oops! Something went wrong'}
        </h3>
        
        <p className="text-red-600 dark:text-red-300 mb-6 text-sm leading-relaxed">
          {message}
        </p>
        
        {isNetworkError && (
          <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-3 mb-6">
            <div className="flex items-center justify-center space-x-2 text-red-700 dark:text-red-300">
              <Wifi className="h-4 w-4" />
              <span className="text-xs">Check your internet connection</span>
            </div>
          </div>
        )}
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 hover:shadow-lg"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
};