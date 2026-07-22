import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  CheckSquare,
  Target,
  Timer,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  Activity,
  X,
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/tasks', label: 'Tasks', icon: CheckSquare },
    { to: '/goals', label: 'Goals', icon: Target },
    { to: '/focus', label: 'Focus Mode', icon: Timer },
    { to: '/journal', label: 'Daily Journal', icon: BookOpen },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [latency, setLatency] = React.useState<number | null>(null);
  const [isOnline, setIsOnline] = React.useState<boolean>(true);

  React.useEffect(() => {
    const checkStatus = async () => {
      const start = performance.now();
      try {
        // Send request to live Render health API
        await fetch('https://momentum-backend-api.onrender.com/api/health/', {
          method: 'HEAD',
        });
        setLatency(Math.round(performance.now() - start));
        setIsOnline(true);
      } catch {
        setIsOnline(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 20000); // Check every 20 seconds
    return () => clearInterval(interval);
  }, []);

  const SidebarContent = (
    <div className="flex flex-col h-full justify-between p-4">
      <div className="space-y-6">
        {/* Header Logo */}
        <div className="flex items-center justify-between px-2 pt-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-wider text-primary-text uppercase">
                MOMENTUM
              </span>
              <span className="text-[10px] block font-mono text-cyan-400">
                MISSION CONTROL
              </span>
            </div>
          </div>

          {/* Close button for mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all relative',
                    {
                      'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.15)]':
                        isActive,
                      'text-secondary-text hover:text-primary-text hover:bg-primary-bg/60': !isActive,
                    }
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="activeIndicator"
                        className="absolute right-2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]"
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer: Telemetry Badge & Logout */}
      <div className="space-y-3 pt-4 border-t border-border-accent">
        {/* Telemetry Status Card */}
        <div className="p-3 rounded-xl bg-primary-bg/60 border border-border-accent space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-secondary-text flex items-center gap-1">
              <Activity className={clsx('w-3 h-3', isOnline ? 'text-emerald-400' : 'text-rose-400')} /> SYSTEM
            </span>
            <span className={clsx('font-bold', isOnline ? 'text-emerald-400' : 'text-rose-400')}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
          <p className="text-[10px] font-mono text-slate-500">
            LATENCY: {latency ? `${latency}ms` : 'Checking...'} • {isOnline ? '99.9%' : '0.0%'}
          </p>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 border border-transparent transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out Session</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed Left Navigation) */}
      <aside className="hidden lg:block w-64 border-r border-border-accent bg-secondary-bg/85 backdrop-blur-xl h-screen sticky top-0 shrink-0">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="absolute inset-0 bg-primary-bg/80 backdrop-blur-md"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-72 bg-secondary-bg border-r border-border-accent h-full shadow-2xl z-10"
            >
              {SidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
