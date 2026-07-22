import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Search, Bell, Shield, Menu, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onToggleMobileSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileSidebar }) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      {/* Left Mobile Menu Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          aria-label="Toggle Navigation Drawer"
          className="lg:hidden p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <span className="font-extrabold text-sm tracking-wider text-slate-100 uppercase">
            MOMENTUM
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            v1.0.0
          </span>
        </div>
      </div>

      {/* Middle Global Search Bar */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative flex items-center w-full">
          <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Quick search commands, tasks, goals... (Ctrl + K)"
            className="w-full pl-10 pr-12 py-2 rounded-xl text-xs font-mono bg-slate-900/60 border border-slate-800 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
          />
          <kbd className="hidden sm:inline-block absolute right-3 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="View Notifications"
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/40 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl z-50 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-100 font-mono uppercase">
                    SYSTEM NOTIFICATIONS
                  </span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 rounded text-slate-400 hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-mono font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Authentication Verified
                    </div>
                    <p className="text-slate-300 font-light text-[11px]">
                      Operator JWT token refresh cycle completed.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> AI Insight Generated
                    </div>
                    <p className="text-slate-300 font-light text-[11px]">
                      Optimal focus window recommendation updated.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Chip */}
        <div className="hidden md:flex items-center gap-3 pl-2 border-l border-slate-800">
          <img
            src={
              user?.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
            }
            alt="User Avatar"
            className="w-8 h-8 rounded-xl object-cover border border-cyan-400/40"
          />
          <div className="text-left text-xs">
            <span className="font-bold text-slate-200 block leading-tight">
              {user?.firstName || 'Operator'}
            </span>
            <span className="text-[10px] font-mono text-cyan-400 leading-tight">
              {user?.role || 'OPERATOR'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
