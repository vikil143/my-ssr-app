import React from 'react';
import { useTheme } from './ThemeProvider.jsx';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="rounded-full border border-slate-900/10 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-900"
      onClick={toggleTheme}
      type="button"
    >
      {theme === 'dark' ? 'Light theme' : 'Dark theme'}
    </button>
  );
}
