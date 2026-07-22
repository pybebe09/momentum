import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'neon-green';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  ariaLabel?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  ariaLabel,
  children,
  className,
  disabled,
  ...props
}) => {
  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      disabled={disabled || isLoading}
      aria-label={ariaLabel || (typeof children === 'string' ? children : 'Action Button')}
      className={clsx(
        'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer',
        {
          // Primary (Cyber Blue Neon Glow)
          'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]':
            variant === 'primary',

          // Neon Green Glow
          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(0,255,157,0.4)]':
            variant === 'neon-green',

          // Secondary (Glass Slate)
          'bg-slate-800/80 text-slate-100 border border-slate-700/80 hover:bg-slate-700/80 hover:border-slate-600':
            variant === 'secondary',

          // Outline
          'bg-transparent text-slate-300 border border-slate-700 hover:border-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-500/10':
            variant === 'outline',

          // Ghost
          'bg-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-800/60':
            variant === 'ghost',

          // Sizes
          'px-3 py-1.5 text-xs font-mono gap-1.5': size === 'sm',
          'px-4 py-2.5 text-xs font-medium gap-2': size === 'md',
          'px-6 py-3.5 text-sm font-semibold gap-2.5': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 animate-spin text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
};
