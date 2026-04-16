import React from 'react';

export default function TextInput({ className = '', error, label, name, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={name}
          className="text-xs font-medium text-slate-600 dark:text-slate-400"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        className={`w-full rounded-2xl border px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none dark:placeholder:text-slate-500 ${
          error
            ? 'border-rose-400 bg-rose-500/5 text-rose-900 focus:border-rose-500 dark:border-rose-400/60 dark:bg-rose-400/5 dark:text-rose-100'
            : 'border-slate-300 bg-white text-slate-950 focus:border-cyan-500 dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:focus:border-cyan-400'
        } ${className}`.trim()}
        {...props}
      />
      {error && (
        <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
      )}
    </div>
  );
}
