import React from 'react';
import Badge from './Badge.jsx';

export default function SectionHeader({ badge, tone = 'cyan', title, description }) {
  return (
    <div className="space-y-3">
      {badge ? <Badge tone={tone}>{badge}</Badge> : null}
      <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
          {description}
        </p>
      ) : null}
    </div>
  );
}
