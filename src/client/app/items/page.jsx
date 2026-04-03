import React, { useState } from 'react';

export default function ItemsPage({ items }) {
  const [input, setInput] = useState('');
  const [previewItem, setPreviewItem] = useState('');

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <span className="inline-flex rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-fuchsia-200">
          Items
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-white">Server data, styled on the client</h2>
        <p className="max-w-2xl text-base leading-7 text-slate-300">
          Use the preview control below to test client-side interaction without changing the
          server-rendered data source.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Preview an item name"
          />
          <button
            className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            onClick={() => setPreviewItem(input)}
          >
            Preview
          </button>
        </div>

        {previewItem && (
          <p className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
            Previewing: <span className="font-semibold">{previewItem}</span>
          </p>
        )}
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item._id}
            className="rounded-3xl border border-white/10 bg-slate-950/40 px-5 py-4 text-sm text-slate-200"
          >
            {item.name}
          </li>
        ))}
      </ul>
    </section>
  );
}
