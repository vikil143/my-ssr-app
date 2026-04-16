import React, { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

const TONE_CLASSES = {
  success:
    'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200',
  error:
    'border-rose-500/30 bg-rose-500/10 text-rose-800 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200',
  info:
    'border-cyan-500/30 bg-cyan-500/10 text-cyan-800 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-200',
  warning:
    'border-amber-500/30 bg-amber-500/10 text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200',
};

const ICONS = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

function ToastItem({ id, message, tone = 'info', onRemove }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-lg backdrop-blur ${TONE_CLASSES[tone]}`}
    >
      <span className="mt-0.5 shrink-0 font-bold">{ICONS[tone]}</span>
      <span className="flex-1 leading-5">{message}</span>
      <button
        className="mt-0.5 shrink-0 opacity-50 transition hover:opacity-100"
        onClick={() => onRemove(id)}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message, tone = 'info', duration = 4000) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, tone }]);
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 flex w-80 flex-col gap-2">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} {...toast} onRemove={removeToast} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
