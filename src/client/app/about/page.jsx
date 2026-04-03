import React from 'react';

export default function AboutPage() {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-200">
          About
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-white">Client styling stack</h2>
        <p className="max-w-2xl text-base leading-7 text-slate-300">
          The client now bundles a Tailwind stylesheet through webpack, so route components
          can use utility classes directly.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Build
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Webpack now processes CSS with PostCSS, Tailwind, and autoprefixer.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Scope
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Tailwind scans the client-side source tree, which keeps generated styles focused.
          </p>
        </div>
      </div>
    </section>
  );
}
