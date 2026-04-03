import React from 'react';

export default function RadioGroup({ label, name, options = [], value, onChange }) {
  return (
    <div className="space-y-3">
      {label ? (
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          {label}
        </p>
      ) : null}
      <div className="grid gap-3">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-900/10 bg-white/60 p-4 transition hover:border-cyan-500/30 dark:border-white/10 dark:bg-white/5"
          >
            <input
              className="mt-1 h-4 w-4 border-slate-300 text-cyan-600 focus:ring-cyan-500 dark:border-white/20 dark:bg-slate-950/60 dark:text-cyan-400 dark:focus:ring-cyan-400"
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className="space-y-1">
              <span className="block text-sm font-semibold text-slate-950 dark:text-white">
                {option.label}
              </span>
              {option.description ? (
                <span className="block text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {option.description}
                </span>
              ) : null}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
