import React, { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

const TONE_CLASSES = {
  success: 'border-[#00875A]/25 bg-[#E3FCEF] text-[#006644] dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200',
  error:   'border-[#DE350B]/25 bg-[#FFEBE6] text-[#BF2600] dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200',
  info:    'border-[#0052CC]/25 bg-[#DEEBFF] text-[#0747A6] dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-200',
  warning: 'border-[#FF991F]/25 bg-[#FFFAE6] text-[#974F0C] dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200',
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
      className={`flex items-start gap-3 rounded-[4px] border px-4 py-3 text-sm shadow-lg ${TONE_CLASSES[tone]}`}
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
