import React from 'react';
import Badge from '../components/Badge.jsx';

export default function NotFoundPage() {
  return (
    <section className="space-y-4 text-center">
      <div>
        <Badge tone="rose">404</Badge>
      </div>
      <h2 className="text-3xl font-bold text-slate-950 dark:text-white sm:text-4xl">Not Found</h2>
      <p className="mx-auto max-w-lg text-base leading-7 text-slate-600 dark:text-slate-300">
        The page you requested does not exist in the current router configuration.
      </p>
    </section>
  );
}
