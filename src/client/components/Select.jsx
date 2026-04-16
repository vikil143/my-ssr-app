import React from 'react';

export default function Select({ children, className = '', ...props }) {
  return (
    <select
      className={`h-9 w-full rounded-[3px] border-2 border-j-line bg-white px-3 text-sm text-j-ink focus:border-j-sky focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400 ${className}`.trim()}
      {...props}
    >
      {children}
    </select>
  );
}
