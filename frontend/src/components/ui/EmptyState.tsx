import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center text-center p-12 bg-muted/20 border-2 border-dashed border-border rounded-[3rem] space-y-4"
  >
    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
      <Icon className="w-10 h-10" />
    </div>
    <div className="space-y-2 max-w-sm">
      <h3 className="text-xl font-black text-foreground tracking-tight">{title}</h3>
      <p className="text-muted-foreground font-medium text-sm leading-relaxed">{description}</p>
    </div>
    {action && <div className="pt-2">{action}</div>}
  </motion.div>
);
