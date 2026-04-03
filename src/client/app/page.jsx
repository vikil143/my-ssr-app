import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
          Home
        </span>
        <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Tailwind is now driving the client presentation layer.
        </h2>
        <p className="max-w-2xl text-base leading-7 text-slate-300">
          This page is still server-rendered, but the hydrated client bundle now includes
          Tailwind utilities for layout, typography, and interaction styling.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold text-white">SSR first</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Initial markup still comes from the Express server before React hydrates.
          </p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold text-white">Utility styling</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Components now use Tailwind classes instead of unstyled HTML defaults.
          </p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold text-white">Shared shell</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Navigation and page framing stay consistent across all client routes.
          </p>
        </article>
      </div>

      <p className="text-sm text-slate-300">
        Visit the{' '}
        <Link className="font-semibold text-cyan-300 hover:text-cyan-200" to="/items">
          items page
        </Link>{' '}
        to see server data inside the new UI.
      </p>
    </section>
  );
}
