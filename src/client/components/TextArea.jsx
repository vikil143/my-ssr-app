import React from 'react';

export default function TextArea({ className = '', rows = 4, ...props }) {
  return (
    <textarea
      className={`w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-400 ${className}`.trim()}
      rows={rows}
      {...props}
    />
  );
}
