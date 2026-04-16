import React from 'react';

export default function Card({ children, className = '', as: Component = 'article' }) {
  return (
    <Component
      className={`rounded-[4px] border border-j-line bg-white px-4 py-3 transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800 ${className}`.trim()}
    >
      {children}
    </Component>
  );
}
