import React from 'react';
import Card from './Card.jsx';

export default function StatCard({ label, value, detail, tone = 'cyan' }) {
  const toneClasses = {
    cyan: 'text-cyan-700 dark:text-cyan-300',
    emerald: 'text-emerald-700 dark:text-emerald-300',
    fuchsia: 'text-fuchsia-700 dark:text-fuchsia-300',
    rose: 'text-rose-700 dark:text-rose-300'
  };

  return (
    <Card className="space-y-2">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className={`text-3xl font-black tracking-tight ${toneClasses[tone] || toneClasses.cyan}`}>
        {value}
      </p>
      {detail ? (
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{detail}</p>
      ) : null}
    </Card>
  );
}
