import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastNotification({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-slideUp">
      <div className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 text-xs font-semibold ${
        toast.type === 'error'
          ? 'bg-red-950/90 text-red-200 border-red-500/40'
          : toast.type === 'info'
          ? 'bg-indigo-950/90 text-indigo-200 border-indigo-500/40'
          : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40'
      }`}>
        <div className="flex items-center gap-2.5">
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          ) : toast.type === 'info' ? (
            <Info className="w-5 h-5 text-indigo-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>

        <button onClick={onClose} className="p-1 hover:opacity-75">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
