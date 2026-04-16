import React from 'react';
import Badge from '../components/Badge.jsx';

export default function NotFoundPage() {
  return (
    <section className="space-y-4 text-center">
      <div>
        <Badge tone="rose">404</Badge>
      </div>
      <h2 className="text-2xl font-bold text-j-ink dark:text-white sm:text-3xl">Not Found</h2>
      <p className="mx-auto max-w-lg text-sm leading-6 text-j-sub dark:text-slate-300">
        The page you requested does not exist in the current router configuration.
      </p>
    </section>
  );
}
