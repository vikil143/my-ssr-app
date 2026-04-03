import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/Badge.jsx';
import Card from '../components/Card.jsx';

export default function HomePage() {
  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <Badge tone="cyan">Home</Badge>
        <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
          Tailwind is now driving the client presentation layer in both light and dark themes.
        </h2>
        <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
          This page is still server-rendered, but the hydrated client bundle now includes
          Tailwind utilities for layout, typography, interaction styling, and theme switching.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">SSR first</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Initial markup still comes from the Express server before React hydrates.
          </p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Utility styling</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Components now use Tailwind classes instead of unstyled HTML defaults.
          </p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Theme aware</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            The UI now supports a persistent light/dark preference across route changes.
          </p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Shared shell</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Navigation and page framing stay consistent across all client routes.
          </p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Client preference</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            The toggle remembers the last selected theme using `localStorage`.
          </p>
        </Card>
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
