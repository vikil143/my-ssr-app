import React from 'react';

export default function Button({ children, className = '', type = 'button', ...props }) {
  return (
    <button
      className={`rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300 ${className}`.trim()}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
