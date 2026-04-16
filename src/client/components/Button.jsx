import React from 'react';

export default function Button({ children, className = '', type = 'button', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-[3px] bg-j-blue px-4 py-1.5 text-sm font-medium text-white transition hover:bg-j-navy focus:outline-none focus:ring-2 focus:ring-j-sky focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700 ${className}`.trim()}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
