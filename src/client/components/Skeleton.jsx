import React from 'react';

export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700/50 ${className}`.trim()}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-[1.25rem] border border-slate-900/10 bg-white/75 p-4 dark:border-white/10 dark:bg-slate-900/65">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="mt-2 h-3 w-1/2" />
    </div>
  );
}

export function SkeletonList({ count = 4 }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </ul>
  );
}
