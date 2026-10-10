import React from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { activeToast, dismissToast } = useNotifications();

  if (!activeToast) return null;

  const getIcon = () => {
    switch (activeToast.type) {
      case 'SUCCESS':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'ERROR':
        return <AlertOctagon className="w-5 h-5 text-rose-400" />;
      default:
        return <Info className="w-5 h-5 text-teal-400" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full pointer-events-none animate-in slide-in-from-bottom-5 duration-300">
      <div className="pointer-events-auto rounded-2xl bg-white/90 dark:bg-midnight-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/15 p-4 shadow-2xl flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
            {activeToast.title}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            {activeToast.message}
          </p>
        </div>
        <button
          type="button"
          onClick={dismissToast}
          aria-label="Dismiss toast alert"
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
