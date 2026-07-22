import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
}) => {
  return (
    <div
      className={clsx(
        'animate-pulse bg-slate-800/60 border border-slate-800/40 relative overflow-hidden',
        {
          'h-4 w-full rounded-md': variant === 'text',
          'rounded-full': variant === 'circular',
          'rounded-xl': variant === 'rectangular',
          'h-32 w-full rounded-2xl p-4': variant === 'card',
        },
        className
      )}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-slate-700/20 to-transparent animate-[shimmer_2s_infinite]" />
    </div>
  );
};
