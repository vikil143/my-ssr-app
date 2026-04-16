import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/Badge.jsx';
import Card from '../components/Card.jsx';

export default function HomePage() {
  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <Badge tone="cyan">Home</Badge>
        <h2 className="max-w-3xl text-xl font-bold tracking-tight text-j-ink dark:text-white sm:text-2xl">
          Tailwind is now driving the client presentation layer in both light and dark themes.
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-j-sub dark:text-slate-300">
          This page is still server-rendered, but the hydrated client bundle now includes
          Tailwind utilities for layout, typography, interaction styling, and theme switching.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <h3 className="text-sm font-semibold text-j-ink dark:text-white">SSR first</h3>
          <p className="mt-1.5 text-sm leading-5 text-j-sub dark:text-slate-300">
            Initial markup still comes from the Express server before React hydrates.
          </p>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-j-ink dark:text-white">Utility styling</h3>
          <p className="mt-1.5 text-sm leading-5 text-j-sub dark:text-slate-300">
            Components now use Tailwind classes instead of unstyled HTML defaults.
          </p>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-j-ink dark:text-white">Theme aware</h3>
          <p className="mt-1.5 text-sm leading-5 text-j-sub dark:text-slate-300">
            The UI now supports a persistent light/dark preference across route changes.
          </p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold text-j-ink dark:text-white">Shared shell</h3>
          <p className="mt-1.5 text-sm leading-5 text-j-sub dark:text-slate-300">
            Navigation and page framing stay consistent across all client routes.
          </p>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-j-ink dark:text-white">Client preference</h3>
          <p className="mt-1.5 text-sm leading-5 text-j-sub dark:text-slate-300">
            The toggle remembers the last selected theme using `localStorage`.
          </p>
        </Card>
      </div>

      <p className="text-sm text-j-sub dark:text-slate-300">
        Visit the{' '}
        <Link className="font-medium text-j-blue hover:text-j-navy hover:underline dark:text-blue-400" to="/items">
          items page
        </Link>{' '}
        to see server data inside the new UI.
      </p>
    </section>
  );
}
