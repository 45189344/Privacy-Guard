import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingFallback: React.FC = () => {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/70 dark:bg-midnight-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-glass-sm text-xs font-semibold text-slate-700 dark:text-slate-300">
        <Loader2 className="w-4 h-4 text-teal-500 animate-spin" />
        <span>Loading PrivacyGuard Module...</span>
      </div>
    </div>
  );
};
