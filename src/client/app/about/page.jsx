import React from 'react';

export default function AboutPage() {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <span className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200">
          About
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Client styling stack</h2>
        <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
          The client now bundles a Tailwind stylesheet through webpack, so route components
          can use utility classes directly and respond to the active theme.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-slate-900/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Build
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Webpack now processes CSS with PostCSS, Tailwind, and autoprefixer.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-900/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Theme
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Tailwind now uses class-based dark mode so the client can switch themes instantly.
          </p>
        </div>
      </div>
    </section>
  );
}
