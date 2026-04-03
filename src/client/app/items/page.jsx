import React, { useState } from 'react';

export default function ItemsPage({ items }) {
  const [input, setInput] = useState('');
  const [previewItem, setPreviewItem] = useState('');

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <span className="inline-flex rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-fuchsia-700 dark:border-fuchsia-400/30 dark:bg-fuchsia-400/10 dark:text-fuchsia-200">
          Items
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Server data, styled on the client</h2>
        <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
          Use the preview control below to test client-side interaction without changing the
          server-rendered data source.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-900/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none dark:border-white/10 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Preview an item name"
          />
          <button
            className="rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
            onClick={() => setPreviewItem(input)}
          >
            Preview
          </button>
        </div>

        {previewItem && (
          <p className="mt-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-800 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-100">
            Previewing: <span className="font-semibold">{previewItem}</span>
          </p>
        )}
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item._id}
            className="rounded-3xl border border-slate-900/10 bg-white/60 px-5 py-4 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-200"
          >
            {item.name}
          </li>
        ))}
      </ul>
    </section>
  );
}
