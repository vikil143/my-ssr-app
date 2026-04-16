import React from 'react';

export default function TextArea({ className = '', rows = 4, ...props }) {
  return (
    <textarea
      className={`w-full rounded-[3px] border-2 border-j-line bg-white px-3 py-2 text-sm text-j-ink placeholder:text-j-mist focus:border-j-sky focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-400 ${className}`.trim()}
      rows={rows}
      {...props}
    />
  );
}
