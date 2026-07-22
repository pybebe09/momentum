import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps extends HTMLMotionProps<'div'> {
  glow?: 'blue' | 'green' | 'amber' | 'none';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  glow = 'none',
  children,
  className,
  ...props
}) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={clsx(
        'glass-card rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl',
        {
          'hover:border-cyan-400/50 hover:shadow-[0_10px_35px_-10px_rgba(0,240,255,0.25)]':
            glow === 'blue',
          'hover:border-emerald-400/50 hover:shadow-[0_10px_35px_-10px_rgba(0,255,157,0.25)]':
            glow === 'green',
          'hover:border-amber-400/50 hover:shadow-[0_10px_35px_-10px_rgba(245,158,11,0.25)]':
            glow === 'amber',
          'hover:border-slate-700/80': glow === 'none',
        },
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
