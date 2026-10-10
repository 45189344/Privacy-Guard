import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { ShieldAlert, RefreshCw, ChevronDown, Check, Info } from 'lucide-react';

export const DemoModeBanner: React.FC = () => {
  const { user, isDemoMode, switchDemoRole, resetDemoData } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!isDemoMode) return null;

  const roles: { role: UserRole; name: string; desc: string }[] = [
    {
      role: 'user',
      name: 'Priya Sharma',
      desc: 'Standard User (Submit, track, verify requests)',
    },
    {
      role: 'dpo_admin',
      name: 'Dr. Vikram Malhotra',
      desc: 'DPO / Admin (Review requests, manage retentions & jobs)',
    },
    {
      role: 'auditor',
      name: 'Sunita Rao',
      desc: 'Auditor (Audit trail inspection & reporting)',
    },
  ];

  return (
    <div className="bg-amber-500/10 dark:bg-amber-500/15 border-b border-amber-500/25 px-4 py-2 text-xs text-amber-900 dark:text-amber-200">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Banner Info */}
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            <strong className="font-semibold">Demonstration Mode:</strong> Using fictional DPDP test fixtures.
            Simulated actions do not affect real production stores.
          </span>
        </div>

        {/* Live Role Switcher & Reset */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-midnight-800/90 border border-amber-500/30 text-slate-800 dark:text-slate-100 hover:border-amber-500 transition-colors shadow-sm"
              aria-label="Switch demonstration profile"
            >
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Viewing as:</span>
              <span className="font-semibold">{user?.fullName || 'Demo User'}</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">
                {user?.role}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-1.5 w-72 rounded-xl bg-white dark:bg-midnight-850 border border-slate-200 dark:border-white/10 shadow-xl p-1.5 z-50">
                <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Info className="w-3 h-3" /> Select Identity
                </div>
                {roles.map((r) => {
                  const isCurrent = user?.role === r.role;
                  return (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => {
                        switchDemoRole(r.role);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg flex items-start justify-between transition-colors ${
                        isCurrent
                          ? 'bg-amber-500/15 text-amber-900 dark:text-amber-200'
                          : 'hover:bg-slate-100 dark:hover:bg-midnight-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-xs flex items-center gap-1.5">
                          {r.name}
                          <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-200 dark:bg-midnight-600">
                            {r.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{r.desc}</div>
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={resetDemoData}
            title="Reset demonstration records to defaults"
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/70 dark:bg-midnight-800/80 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:border-rose-400 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline text-[11px]">Reset Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
