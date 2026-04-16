import React from 'react';

export default function Checkbox({ label, hint, checked, className = '', ...props }) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-[3px] border border-j-line bg-white p-3 transition hover:border-j-sky dark:border-slate-700 dark:bg-slate-800 ${className}`.trim()}
    >
      <input
        className="mt-0.5 h-4 w-4 rounded-[2px] border-j-line text-j-blue focus:ring-j-sky dark:border-slate-600 dark:bg-slate-900 dark:text-blue-400 dark:focus:ring-blue-400"
        type="checkbox"
        checked={checked}
        {...props}
      />
      <span className="space-y-1">
        <span className="block text-sm font-medium text-j-ink dark:text-white">{label}</span>
        {hint ? (
          <span className="block text-sm leading-5 text-j-sub dark:text-slate-300">{hint}</span>
        ) : null}
      </span>
    </label>
  );
}
