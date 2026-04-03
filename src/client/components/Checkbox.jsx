import React from 'react';

export default function Checkbox({ label, hint, checked, className = '', ...props }) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-900/10 bg-white/60 p-4 transition hover:border-cyan-500/30 dark:border-white/10 dark:bg-white/5 ${className}`.trim()}
    >
      <input
        className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 dark:border-white/20 dark:bg-slate-950/60 dark:text-cyan-400 dark:focus:ring-cyan-400"
        type="checkbox"
        checked={checked}
        {...props}
      />
      <span className="space-y-1">
        <span className="block text-sm font-semibold text-slate-950 dark:text-white">{label}</span>
        {hint ? (
          <span className="block text-sm leading-6 text-slate-600 dark:text-slate-300">{hint}</span>
        ) : null}
      </span>
    </label>
  );
}
