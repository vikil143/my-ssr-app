import React from 'react';

export default function TextInput({ className = '', error, label, name, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={name}
          className="text-xs font-medium text-j-sub dark:text-slate-400"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        className={`h-9 w-full rounded-[3px] border-2 px-3 text-sm placeholder:text-j-mist focus:outline-none dark:placeholder:text-slate-500 ${
          error
            ? 'border-j-red bg-[#FFEBE6]/20 text-j-ink focus:border-j-red dark:border-red-400/60 dark:bg-red-400/5 dark:text-slate-100'
            : 'border-j-line bg-white text-j-ink focus:border-j-sky dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-400'
        } ${className}`.trim()}
        {...props}
      />
      {error && (
        <p className="text-xs text-j-red dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
