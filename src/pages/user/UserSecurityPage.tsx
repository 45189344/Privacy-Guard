import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Shield, Lock, Smartphone, KeyRound, CheckCircle2 } from 'lucide-react';

export const UserSecurityPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Security Controls & Authentication
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage authentication factors protecting your data deletion authority
        </p>
      </div>

      <GlassCard variant="elevated" className="p-8 space-y-6">
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-midnight-950/60 border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                  Multi-Factor Authentication (MFA)
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Required before executing high-impact account-level deletion
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>ACTIVE</span>
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-midnight-950/60 border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                  Active Session Tokens
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Current browser session authenticated via encrypted cookie
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              1 Active Device
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-midnight-950/60 border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                  Possession Proof Key
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Cryptographic challenge key used for request integrity
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-teal-600 dark:text-teal-400 font-bold">
              Ed25519-Verified
            </span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
