import React, { useState, useEffect } from 'react';
import Badge     from '../../components/Badge.jsx';
import Button    from '../../components/Button.jsx';
import Card      from '../../components/Card.jsx';
import TextInput from '../../components/TextInput.jsx';
import TextArea  from '../../components/TextArea.jsx';
import Select    from '../../components/Select.jsx';
import { SkeletonList } from '../../components/Skeleton.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import useFormValidation from '../../hooks/useFormValidation.js';
import { apiFetch, ApiError } from '../../lib/api.js';

// ── Constants ────────────────────────────────────────────────────────────────

const PRIORITY_CONFIG = {
  high:   { label: 'High',   tone: 'rose',    dot: 'bg-j-red' },
  medium: { label: 'Medium', tone: 'cyan',    dot: 'bg-j-yellow' },
  low:    { label: 'Low',    tone: 'emerald', dot: 'bg-j-green' },
};

const STATUS_NEXT   = { todo: 'in-progress', 'in-progress': 'done', done: 'todo' };
const STATUS_LABELS = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' };
const STATUS_TABS   = ['all', 'todo', 'in-progress', 'done'];

const CREATE_SCHEMA = {
  title: [
    'required',
    (v) => (v && v.length < 2 ? 'Title must be at least 2 characters.' : null),
  ],
};

// ── Main page ────────────────────────────────────────────────────────────────

export default function TasksPage({ tasks: initialTasks }) {
  const { addToast } = useToast();

  // ── List state ──────────────────────────────────────────────────────────────
  const [tasks, setTasks] = useState(initialTasks || []);
  // Show skeleton on mount only when there is no SSR data (client-side navigation)
  const [listLoading, setListLoading] = useState(!(initialTasks?.length > 0));
  const [statusFilter, setStatusFilter]     = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // ── Create form state ────────────────────────────────────────────────────────
  const [showForm, setShowForm]       = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [selPriority, setSelPriority] = useState('medium');
  const [description, setDescription] = useState('');

  // ── Edit state ───────────────────────────────────────────────────────────────
  const [editingId, setEditingId]           = useState(null);
  const [editValues, setEditValues]         = useState({ title: '', description: '', priority: 'medium' });
  const [editSubmitting, setEditSubmitting] = useState(false);

  // ── Delete confirmation state ────────────────────────────────────────────────
  const [deletingId, setDeletingId] = useState(null);

  const { values, errors, handleChange, handleBlur, validate, reset } =
    useFormValidation(CREATE_SCHEMA);

  // ── Auto-fetch on mount ──────────────────────────────────────────────────────
  // Covers client-side navigation (no SSR) and keeps the list fresh after hydration.
  // When SSR data is present listLoading is already false, so the fetch runs silently
  // in the background without showing a skeleton.
  useEffect(() => {
    let cancelled = false;

    apiFetch('/api/tasks')
      .then((data) => {
        if (!cancelled) setTasks(data);
      })
      .catch((err) => {
        // Only show the error toast when we have nothing to show the user
        if (!cancelled && !(initialTasks?.length > 0)) {
          addToast(
            err instanceof ApiError ? err.message : 'Failed to load tasks.',
            'error'
          );
        }
      })
      .finally(() => {
        if (!cancelled) setListLoading(false);
      });

    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived data ─────────────────────────────────────────────────────────────

  const filtered = tasks.filter((t) => {
    const sOk = statusFilter === 'all'   || t.status   === statusFilter;
    const pOk = priorityFilter === 'all' || t.priority === priorityFilter;
    return sOk && pOk;
  });

  const counts = {
    all:           tasks.length,
    todo:          tasks.filter((t) => t.status === 'todo').length,
    'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
    done:          tasks.filter((t) => t.status === 'done').length,
  };

  // ── Handlers ─────────────────────────────────────────────────────────────────

  async function handleRefresh() {
    setListLoading(true);
    try {
      const data = await apiFetch('/api/tasks');
      setTasks(data);
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Failed to load tasks.', 'error');
    } finally {
      setListLoading(false);
    }
  }

  // ── Create ──────────────────────────────────────────────────────────────────

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const created = await apiFetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title:       values.title.trim(),
          description: description.trim(),
          priority:    selPriority,
        }),
      });
      setTasks((prev) => [created, ...prev]);
      addToast(`Task "${created.title}" created.`, 'success');
      reset();
      setDescription('');
      setSelPriority('medium');
      setShowForm(false);
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Failed to create task.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  // ── Status cycle (optimistic update) ────────────────────────────────────────

  async function handleStatusCycle(task) {
    const nextStatus = STATUS_NEXT[task.status];

    // Apply optimistically so the UI responds instantly
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, status: nextStatus } : t))
    );

    try {
      const updated = await apiFetch(`/api/tasks/${task._id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: nextStatus }),
      });
      // Replace with the server's version (has correct updatedAt etc.)
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    } catch (err) {
      // Revert to the original status on failure
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: task.status } : t))
      );
      addToast(err instanceof ApiError ? err.message : 'Failed to update task.', 'error');
    }
  }

  // ── Delete (two-click confirmation) ─────────────────────────────────────────

  async function handleDelete(taskId, taskTitle) {
    // First click: arm the confirmation state
    if (deletingId !== taskId) {
      setDeletingId(taskId);
      return;
    }
    // Second click on the same task: confirmed, execute
    try {
      await apiFetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      addToast(`"${taskTitle}" deleted.`, 'success');
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Failed to delete task.', 'error');
    } finally {
      setDeletingId(null);
    }
  }

  function handleDeleteCancel() {
    setDeletingId(null);
  }

  // ── Edit ────────────────────────────────────────────────────────────────────

  function handleEditStart(task) {
    setEditingId(task._id);
    setEditValues({
      title:       task.title,
      description: task.description || '',
      priority:    task.priority,
    });
  }

  async function handleEditSave(taskId) {
    const title = editValues.title.trim();
    if (!title || title.length < 2) {
      addToast('Title must be at least 2 characters.', 'error');
      return;
    }
    setEditSubmitting(true);
    try {
      const updated = await apiFetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({
          title,
          description: editValues.description.trim(),
          priority:    editValues.priority,
        }),
      });
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      addToast('Task updated.', 'success');
      setEditingId(null);
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Failed to update task.', 'error');
    } finally {
      setEditSubmitting(false);
    }
  }

  function handleEditCancel() {
    setEditingId(null);
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <section className="space-y-8">

      {/* ── Page header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <Badge tone="fuchsia">Tasks</Badge>
          <h2 className="text-xl font-bold tracking-tight text-j-ink dark:text-white">
            My Tasks
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-j-sub dark:text-slate-300">
            Create tasks, set priorities, and track progress from To Do to Done.
          </p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)} className="mt-1 shrink-0">
          {showForm ? 'Cancel' : '+ New Task'}
        </Button>
      </div>

      {/* ── Create task form ── */}
      {showForm && (
        <Card as="div" className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-j-sub dark:text-slate-400">
            New Task
          </p>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <TextInput
              name="title"
              label="Title"
              placeholder="What needs to be done?"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.title}
              disabled={submitting}
            />
            <div>
              <label className="mb-1.5 block text-xs font-medium text-j-sub dark:text-slate-400">
                Description
              </label>
              <TextArea
                placeholder="Add more details (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={submitting}
                rows={3}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-j-sub dark:text-slate-400">
                Priority
              </label>
              <Select
                value={selPriority}
                onChange={(e) => setSelPriority(e.target.value)}
                disabled={submitting}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-[3px] border border-j-line px-4 py-1.5 text-sm font-medium text-j-blue transition hover:bg-j-snow dark:border-slate-600 dark:text-blue-400 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Creating…' : 'Create Task'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-[3px] px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                statusFilter === s
                  ? 'bg-j-blue text-white'
                  : 'bg-j-snow text-j-sub hover:bg-j-line dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {s === 'all' ? 'All' : STATUS_LABELS[s]}&nbsp;
              <span className="opacity-70">({counts[s]})</span>
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="!w-auto py-1.5 text-xs"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
        </div>
      </div>

      {/* ── Task list ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-j-mist dark:text-slate-400">
            {filtered.length} task{filtered.length !== 1 ? 's' : ''}
            {(statusFilter !== 'all' || priorityFilter !== 'all') && ' · filtered'}
          </p>
          <Button onClick={handleRefresh} disabled={listLoading} className="px-4 py-2 text-xs">
            {listLoading ? 'Refreshing…' : 'Refresh'}
          </Button>
        </div>

        {listLoading ? (
          <SkeletonList count={3} />
        ) : filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-j-mist dark:text-slate-400">
            {tasks.length === 0
              ? 'No tasks yet. Hit "+ New Task" to get started.'
              : 'No tasks match the current filters.'}
          </p>
        ) : (
          <ul className="space-y-3">
            {filtered.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onStatusCycle={handleStatusCycle}
                onDelete={handleDelete}
                onDeleteCancel={handleDeleteCancel}
                deletingId={deletingId}
                editingId={editingId}
                editValues={editValues}
                setEditValues={setEditValues}
                editSubmitting={editSubmitting}
                onEditStart={handleEditStart}
                onEditSave={handleEditSave}
                onEditCancel={handleEditCancel}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

// ── Task card ─────────────────────────────────────────────────────────────────

function TaskCard({
  task,
  onStatusCycle,
  onDelete,
  onDeleteCancel,
  deletingId,
  editingId,
  editValues,
  setEditValues,
  editSubmitting,
  onEditStart,
  onEditSave,
  onEditCancel,
}) {
  const pc           = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const isDone       = task.status === 'done';
  const isInProgress = task.status === 'in-progress';
  const isEditing    = editingId === task._id;
  const isDeleting   = deletingId === task._id;

  // ── Edit mode ────────────────────────────────────────────────────────────────
  if (isEditing) {
    return (
      <Card as="li" className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-j-sub dark:text-slate-400">
          Edit Task
        </p>
        <div className="space-y-3">
          <TextInput
            name={`edit-title-${task._id}`}
            label="Title"
            value={editValues.title}
            onChange={(e) =>
              setEditValues((v) => ({ ...v, title: e.target.value }))
            }
            disabled={editSubmitting}
          />
          <div>
            <label className="mb-1.5 block text-xs font-medium text-j-sub dark:text-slate-400">
              Description
            </label>
            <TextArea
              value={editValues.description}
              onChange={(e) =>
                setEditValues((v) => ({ ...v, description: e.target.value }))
              }
              disabled={editSubmitting}
              rows={2}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-j-sub dark:text-slate-400">
              Priority
            </label>
            <Select
              value={editValues.priority}
              onChange={(e) =>
                setEditValues((v) => ({ ...v, priority: e.target.value }))
              }
              disabled={editSubmitting}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onEditCancel}
              disabled={editSubmitting}
              className="inline-flex items-center justify-center rounded-[3px] border border-j-line px-4 py-1.5 text-sm font-medium text-j-blue transition hover:bg-j-snow disabled:opacity-50 dark:border-slate-600 dark:text-blue-400 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <Button
              onClick={() => onEditSave(task._id)}
              disabled={editSubmitting}
            >
              {editSubmitting ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // ── Normal / delete-confirm mode ─────────────────────────────────────────────
  return (
    <Card
      as="li"
      className={`flex items-start gap-3 transition-shadow hover:shadow-md ${isDone ? 'opacity-60' : ''}`}
    >
      {/* Status circle — click to advance: todo → in-progress → done → todo */}
      <button
        onClick={() => onStatusCycle(task)}
        title={`Mark as ${STATUS_LABELS[STATUS_NEXT[task.status]]}`}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-j-sky ${
          isDone
            ? 'border-j-green bg-j-green'
            : isInProgress
            ? 'border-j-blue bg-[#DEEBFF] dark:border-blue-400 dark:bg-blue-400/20'
            : 'border-j-line bg-transparent hover:border-j-sub dark:border-slate-500 dark:hover:border-slate-300'
        }`}
      >
        {isDone && (
          <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
            <path
              d="M2 6l3 3 5-5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {isInProgress && (
          <span className="h-2 w-2 rounded-full bg-j-blue dark:bg-blue-400" />
        )}
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-sm font-semibold ${
              isDone
                ? 'text-j-mist line-through dark:text-slate-500'
                : 'text-j-ink dark:text-white'
            }`}
          >
            {task.title}
          </span>
          <Badge tone={pc.tone}>{pc.label}</Badge>
          {task.status !== 'todo' && (
            <span
              className={`text-xs font-medium ${
                isDone
                  ? 'text-j-green dark:text-emerald-400'
                  : 'text-j-blue dark:text-blue-400'
              }`}
            >
              {STATUS_LABELS[task.status]}
            </span>
          )}
        </div>
        {task.description && (
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-j-sub dark:text-slate-400">
            {task.description}
          </p>
        )}
      </div>

      {/* Action area */}
      <div className="flex shrink-0 items-center gap-1">
        {isDeleting ? (
          /* Inline delete confirmation */
          <div className="flex items-center gap-2 rounded-[3px] bg-[#FFEBE6] px-2 py-1">
            <span className="text-xs font-medium text-j-red">Delete?</span>
            <button
              onClick={() => onDelete(task._id, task.title)}
              className="text-xs font-semibold text-j-red underline hover:no-underline"
            >
              Yes
            </button>
            <button
              onClick={onDeleteCancel}
              className="text-xs font-semibold text-j-sub hover:text-j-ink dark:text-slate-400"
            >
              No
            </button>
          </div>
        ) : (
          <>
            {/* Edit */}
            <button
              onClick={() => onEditStart(task)}
              title="Edit task"
              className="rounded-[3px] p-1.5 text-j-mist transition hover:bg-[#DEEBFF] hover:text-j-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-j-sky dark:text-slate-500 dark:hover:bg-blue-400/10 dark:hover:text-blue-400"
            >
              <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
                <path
                  d="M11.333 2a1.886 1.886 0 0 1 2.667 2.667L5.333 13.333H2.667V10.667L11.333 2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Delete */}
            <button
              onClick={() => onDelete(task._id, task.title)}
              title="Delete task"
              className="rounded-[3px] p-1.5 text-j-mist transition hover:bg-[#FFEBE6] hover:text-j-red focus:outline-none focus-visible:ring-2 focus-visible:ring-j-red dark:text-slate-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
            >
              <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </Card>
  );
}
