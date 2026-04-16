import React from 'react';
import Card from './Card.jsx';

export default function StatCard({ label, value, detail, tone = 'cyan' }) {
  const toneClasses = {
    cyan:    'text-j-blue dark:text-blue-400',
    emerald: 'text-j-green dark:text-emerald-400',
    fuchsia: 'text-[#6554C0] dark:text-purple-400',
    rose:    'text-j-red dark:text-red-400',
  };

  return (
    <Card className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-j-sub dark:text-slate-400">
        {label}
      </p>
      <p className={`text-2xl font-bold tracking-tight ${toneClasses[tone] || toneClasses.cyan}`}>
        {value}
      </p>
      {detail ? (
        <p className="text-sm leading-5 text-j-sub dark:text-slate-300">{detail}</p>
      ) : null}
    </Card>
  );
}
