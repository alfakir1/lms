import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  trendUp = true,
  color = 'bg-primary',
  delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={clsx('p-3 rounded-xl', color)}>
        <Icon className="text-white w-6 h-6" />
      </div>
      {trend && (
        <span
          className={clsx(
            'text-xs font-bold px-2 py-1 rounded-full',
            trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600',
          )}
        >
          {trend}
        </span>
      )}
    </div>
    <p className="text-slate-500 text-sm">{title}</p>
    <p className="text-2xl font-black text-slate-900 mt-0.5">{value}</p>
  </motion.div>
);

export default StatCard;
