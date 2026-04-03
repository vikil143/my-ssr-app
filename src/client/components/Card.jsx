import React from 'react';

export default function Card({ children, className = '', as: Component = 'article' }) {
  return (
    <Component
      className={`rounded-3xl border border-slate-900/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5 ${className}`.trim()}
    >
      {children}
    </Component>
  );
}
