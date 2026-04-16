import React from 'react';

export default function RadioGroup({ label, name, options = [], value, onChange }) {
  return (
    <div className="space-y-3">
      {label ? (
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-j-sub dark:text-slate-400">
          {label}
        </p>
      ) : null}
      <div className="grid gap-3">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-start gap-3 rounded-[3px] border border-j-line bg-white p-3 transition hover:border-j-sky dark:border-slate-700 dark:bg-slate-800"
          >
            <input
              className="mt-0.5 h-4 w-4 border-j-line text-j-blue focus:ring-j-sky dark:border-slate-600 dark:bg-slate-900 dark:text-blue-400 dark:focus:ring-blue-400"
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className="space-y-1">
              <span className="block text-sm font-medium text-j-ink dark:text-white">
                {option.label}
              </span>
              {option.description ? (
                <span className="block text-sm leading-5 text-j-sub dark:text-slate-300">
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
