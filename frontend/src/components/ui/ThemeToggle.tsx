import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      onClick={toggleTheme}
      className="p-2 rounded-xl border border-slate-800 dark:border-slate-800 light:border-slate-300 bg-slate-900/60 dark:bg-slate-900/80 light:bg-slate-100 text-cyan-400 dark:text-cyan-400 light:text-amber-500 hover:border-cyan-400/40 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700" />
      )}
    </motion.button>
  );
};
