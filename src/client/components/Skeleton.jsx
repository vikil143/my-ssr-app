import React from 'react';

export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-[4px] bg-j-line dark:bg-slate-700/50 ${className}`.trim()}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-[4px] border border-j-line bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
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
