import React from 'react';
import { clsx } from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fullPage?: boolean;
}

const sizes = { sm: 'h-6 w-6', md: 'h-10 w-10', lg: 'h-14 w-14', xl: 'h-20 w-20' };

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  fullPage = false,
}) => {
  const spinner = (
    <div
      className={clsx(
        'animate-spin rounded-full border-t-2 border-b-2 border-primary',
        sizes[size],
        className,
      )}
    />
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-10">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
