import React, { useState } from 'react';
import Badge from '../../components/Badge.jsx';
import Button from '../../components/Button.jsx';
import Card from '../../components/Card.jsx';
import TextInput from '../../components/TextInput.jsx';

export default function ItemsPage({ items }) {
  const [input, setInput] = useState('');
  const [previewItem, setPreviewItem] = useState('');

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <Badge tone="fuchsia">Items</Badge>
        <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Server data, styled on the client</h2>
        <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
          Use the preview control below to test client-side interaction without changing the
          server-rendered data source.
        </p>
      </div>

      <Card as="div">
        <div className="flex flex-col gap-3 sm:flex-row">
          <TextInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Preview an item name"
          />
          <Button onClick={() => setPreviewItem(input)}>
            Preview
          </Button>
        </div>

        {previewItem && (
          <p className="mt-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-800 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-100">
            Previewing: <span className="font-semibold">{previewItem}</span>
          </p>
        )}
      </Card>

      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <Card as="li" key={item._id} className="text-sm text-slate-700 dark:bg-slate-950/40 dark:text-slate-200">
            {item.name}
          </Card>
        ))}
      </ul>
    </section>
  );
}
