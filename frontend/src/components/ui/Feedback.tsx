import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  title = "Something went wrong", 
  message, 
  onRetry 
}) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-soft border border-rose-100 p-8 text-center animate-in fade-in slide-in-from-bottom-4">
      <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-5">
        <AlertCircle className="h-8 w-8 text-rose-500" />
      </div>
      <h3 className="text-xl font-display font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="border-slate-200 hover:bg-slate-50 text-slate-700">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export const LoadingSpinner: React.FC<{ text?: string }> = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
        <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
      </div>
      <p className="text-slate-500 font-medium animate-pulse">{text}</p>
    </div>
  );
};

export const EmptyState: React.FC<{
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}> = ({ title, description, icon, action }) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-soft border border-slate-100 p-12 text-center animate-in fade-in slide-in-from-bottom-4">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
        {icon || <div className="h-10 w-10 border-2 border-dashed border-slate-300 rounded-lg"></div>}
      </div>
      <h3 className="text-xl font-display font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};
