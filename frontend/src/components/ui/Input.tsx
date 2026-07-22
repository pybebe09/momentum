import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-slate-300 tracking-wide uppercase font-mono select-none"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none shrink-0">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={clsx(
            'w-full py-2.5 rounded-xl text-xs bg-slate-950/80 border text-slate-100 placeholder:text-slate-500 transition-all duration-200 focus-ring',
            {
              'pl-10': leftIcon,
              'px-4': !leftIcon,
              'pr-10': rightIcon,
              'border-slate-800 focus:border-cyan-400': !error,
              'border-rose-500/80 focus:border-rose-400': error,
            },
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 text-slate-400 shrink-0 cursor-pointer">
            {rightIcon}
          </div>
        )}
      </div>
      {error ? (
        <span className="text-[11px] font-medium text-rose-400">{error}</span>
      ) : helperText ? (
        <span className="text-[11px] font-mono text-slate-400">{helperText}</span>
      ) : null}
    </div>
  );
};
