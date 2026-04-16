import React, { useState } from 'react';
import Badge from '../../components/Badge.jsx';
import Button from '../../components/Button.jsx';
import Card from '../../components/Card.jsx';
import TextInput from '../../components/TextInput.jsx';
import { SkeletonList } from '../../components/Skeleton.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import useFormValidation from '../../hooks/useFormValidation.js';
import { apiFetch, ApiError } from '../../lib/api.js';

// Validation schema: name is required and must be at least 2 characters
const SCHEMA = {
  name: ['required', (v) => (v && v.length < 2 ? 'Name must be at least 2 characters.' : null)],
};

export default function ItemsPage({ items: initialItems }) {
  const { addToast } = useToast();

  // ── List state ──────────────────────────────────────────────────────────────
  const [items, setItems]         = useState(initialItems || []);
  const [listLoading, setListLoading] = useState(false);

  // ── Form state (via validation hook) ────────────────────────────────────────
  const { values, errors, handleChange, handleBlur, validate, reset } =
    useFormValidation(SCHEMA);
  const [submitting, setSubmitting] = useState(false);

  // ── Refresh: fetch items from API, show skeleton while loading ───────────────
  async function handleRefresh() {
    setListLoading(true);
    try {
      const data = await apiFetch('/api/items');
      setItems(data);
      addToast('Items refreshed successfully.', 'success');
    } catch (err) {
      // API error handling — display structured message from ApiError
      addToast(err instanceof ApiError ? err.message : 'Failed to load items.', 'error');
    } finally {
      setListLoading(false);
    }
  }

  // ── Add Item: validate form, POST to API, update list, show toast ────────────
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return; // form validation gate

    setSubmitting(true);
    try {
      const created = await apiFetch('/api/items', {
        method: 'POST',
        body: JSON.stringify({ name: values.name.trim() }),
      });
      setItems((prev) => [created, ...prev]);
      addToast(`"${created.name}" was added.`, 'success');
      reset();
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Failed to add item.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="space-y-8">
      {/* ── Header ── */}
      <div className="space-y-3">
        <Badge tone="fuchsia">Items</Badge>
        <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
          Server data, styled on the client
        </h2>
        <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
          This page demonstrates loading states, form validation, toast notifications, and
          client-side API error handling — all wired up together.
        </p>
      </div>

      {/* ── Add Item Form (validation + toast + API error handling) ── */}
      <Card as="div" className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Add Item
        </p>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <TextInput
              name="name"
              label="Item name"
              placeholder="Enter a name (min 2 characters)"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              disabled={submitting}
            />
          </div>
          <Button type="submit" disabled={submitting} className="shrink-0">
            {submitting ? 'Adding…' : 'Add Item'}
          </Button>
        </form>
      </Card>

      {/* ── Item List (skeleton loader + refresh) ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            {items.length} item{items.length !== 1 ? 's' : ''}
          </p>
          <Button onClick={handleRefresh} disabled={listLoading} className="text-xs px-4 py-2">
            {listLoading ? 'Refreshing…' : 'Refresh'}
          </Button>
        </div>

        {/* Skeleton shown while re-fetching */}
        {listLoading ? (
          <SkeletonList count={items.length || 4} />
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No items yet. Add one above.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {items.map((item) => (
              <Card
                as="li"
                key={item._id}
                className="text-sm text-slate-700 dark:bg-slate-950/40 dark:text-slate-200"
              >
                {item.name}
              </Card>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
