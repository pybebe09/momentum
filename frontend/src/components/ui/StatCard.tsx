import React from 'react';
import { Card } from './Card';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  trend?: string;
  accentColor?: string;
  icon: React.ReactNode;
  glow?: 'blue' | 'green' | 'amber' | 'none';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeType = 'positive',
  trend,
  icon,
  glow = 'blue',
}) => {
  return (
    <Card glow={glow} className="p-5 flex flex-col justify-between space-y-3 relative overflow-hidden group">
      {/* Background Gradient Subtle Glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/10 via-transparent to-transparent rounded-bl-full pointer-events-none group-hover:from-cyan-500/20 transition-all duration-500" />

      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase">
          {title}
        </span>
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-cyan-400 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>

      <div className="space-y-1">
        <motion.span
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 font-sans block"
        >
          {value}
        </motion.span>

        <div className="flex items-center justify-between text-xs font-mono pt-1">
          {subtitle ? (
            <span className="text-slate-400 font-light">{subtitle}</span>
          ) : (
            <span className="text-slate-400 font-light">{trend || 'vs previous cycle'}</span>
          )}
          {change && (
            <span
              className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                changeType === 'positive'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : changeType === 'negative'
                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {change}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
