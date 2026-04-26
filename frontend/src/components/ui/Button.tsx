import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const variants = {
  primary:   'bg-primary hover:bg-primary-600 text-white shadow-lg shadow-primary/20',
  secondary: 'bg-secondary hover:bg-secondary-600 text-white shadow-lg shadow-secondary/20',
  ghost:     'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
  danger:    'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20',
};

const sizes = {
  sm: 'text-xs px-3 py-1.5 rounded-lg',
  md: 'text-sm px-4 py-2.5 rounded-xl',
  lg: 'text-base px-6 py-3 rounded-xl',
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  className,
  disabled,
  ...props
}) => (
  <button
    disabled={disabled || loading}
    className={clsx(
      'inline-flex items-center justify-center gap-2 font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
      variants[variant],
      sizes[size],
      className,
    )}
    {...props}
  >
    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
    {!loading && icon && iconPosition === 'left' && icon}
    {children}
    {!loading && icon && iconPosition === 'right' && icon}
  </button>
);

export default Button;
