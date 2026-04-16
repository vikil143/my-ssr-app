import React from 'react';

export default function FeatureItem({ title, description }) {
  return (
    <div className="flex gap-3">
      <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-j-blue dark:bg-blue-400" />
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-j-ink dark:text-white">{title}</h3>
        <p className="text-sm leading-5 text-j-sub dark:text-slate-300">{description}</p>
      </div>
    </div>
  );
}
