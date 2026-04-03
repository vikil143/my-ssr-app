import React from 'react';

export default function Select({ children, className = '', ...props }) {
  return (
    <select
      className={`w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 focus:border-cyan-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:focus:border-cyan-400 ${className}`.trim()}
      {...props}
    >
      {children}
    </select>
  );
}
