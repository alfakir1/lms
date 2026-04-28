import React from 'react';
import { clsx } from 'clsx';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';

const variants: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger:  'bg-red-50 text-red-700',
  info:    'bg-blue-50 text-blue-700',
  purple:  'bg-purple-50 text-purple-700',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => (
  <span
    className={clsx(
      'inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full',
      variants[variant],
      className,
    )}
  >
    {children}
  </span>
);

export default Badge;
