import React from 'react';

export default function FeatureItem({ title, description }) {
  return (
    <div className="flex gap-3">
      <div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-500 dark:bg-cyan-300" />
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-slate-950 dark:text-white">{title}</h3>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
      </div>
    </div>
  );
}
