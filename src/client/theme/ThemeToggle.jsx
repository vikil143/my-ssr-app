import React from 'react';
import { useTheme } from './ThemeProvider.jsx';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="rounded-[3px] border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-white/80 transition hover:bg-white/20 hover:text-white dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
      onClick={toggleTheme}
      type="button"
    >
      {theme === 'dark' ? 'Light theme' : 'Dark theme'}
    </button>
  );
}
