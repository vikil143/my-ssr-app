import React from 'react';
import Badge from '../../components/Badge.jsx';
import Card from '../../components/Card.jsx';

export default function AboutPage() {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <Badge tone="emerald">About</Badge>
        <h2 className="text-xl font-bold tracking-tight text-j-ink dark:text-white">Client styling stack</h2>
        <p className="max-w-2xl text-sm leading-6 text-j-sub dark:text-slate-300">
          The client now bundles a Tailwind stylesheet through webpack, so route components
          can use utility classes directly and respond to the active theme.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card as="div">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-j-sub dark:text-slate-400">
            Build
          </p>
          <p className="mt-2 text-sm leading-5 text-j-sub dark:text-slate-300">
            Webpack now processes CSS with PostCSS, Tailwind, and autoprefixer.
          </p>
        </Card>
        <Card as="div">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-j-sub dark:text-slate-400">
            Theme
          </p>
          <p className="mt-2 text-sm leading-5 text-j-sub dark:text-slate-300">
            Tailwind now uses class-based dark mode so the client can switch themes instantly.
          </p>
        </Card>
      </div>
    </section>
  );
}
