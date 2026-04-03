import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <span className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-200">
          Home
        </span>
        <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
          Tailwind is now driving the client presentation layer in both light and dark themes.
        </h2>
        <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
          This page is still server-rendered, but the hydrated client bundle now includes
          Tailwind utilities for layout, typography, interaction styling, and theme switching.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-slate-900/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">SSR first</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Initial markup still comes from the Express server before React hydrates.
          </p>
        </article>
        <article className="rounded-3xl border border-slate-900/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Utility styling</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Components now use Tailwind classes instead of unstyled HTML defaults.
          </p>
        </article>
        <article className="rounded-3xl border border-slate-900/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Theme aware</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            The UI now supports a persistent light/dark preference across route changes.
          </p>
        </article>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl border border-slate-900/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Shared shell</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Navigation and page framing stay consistent across all client routes.
          </p>
        </article>
        <article className="rounded-3xl border border-slate-900/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Client preference</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            The toggle remembers the last selected theme using `localStorage`.
          </p>
        </article>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300">
        Visit the{' '}
        <Link className="font-semibold text-cyan-700 hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200" to="/items">
          items page
        </Link>{' '}
        to see server data inside the new UI.
      </p>
    </section>
  );
}
