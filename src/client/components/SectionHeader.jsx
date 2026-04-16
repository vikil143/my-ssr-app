import React from 'react';
import Badge from './Badge.jsx';

export default function SectionHeader({ badge, tone = 'cyan', title, description }) {
  return (
    <div className="space-y-2">
      {badge ? <Badge tone={tone}>{badge}</Badge> : null}
      <h2 className="text-xl font-bold tracking-tight text-j-ink dark:text-white sm:text-2xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-sm leading-6 text-j-sub dark:text-slate-300">
          {description}
        </p>
      ) : null}
    </div>
  );
}
