import React from 'react';
import { motion } from 'framer-motion';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <motion.div
    initial={{ opacity: 0.5 }}
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    className={`bg-muted/50 rounded-lg ${className}`}
  />
);

export const DashboardSkeleton = () => (
  <div className="space-y-10 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-40" />
      </div>
      <Skeleton className="h-12 w-12 rounded-xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Skeleton className="lg:col-span-2 h-[400px] rounded-3xl" />
      <Skeleton className="h-[400px] rounded-3xl" />
    </div>
  </div>
);

export const CourseListSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[1, 2, 3, 4, 5, 6].map(i => (
      <div key={i} className="space-y-4">
        <Skeleton className="h-48 rounded-3xl" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex justify-between">
           <Skeleton className="h-8 w-20 rounded-full" />
           <Skeleton className="h-8 w-24 rounded-xl" />
        </div>
      </div>
    ))}
  </div>
);
