import React from 'react';
import { isSupabaseConfigured } from '@/services/supabase';
import { GlassCard } from '@/components/ui/GlassCard';
import { Settings, Database, ShieldCheck, Key, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          System Configuration & Data Infrastructure
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Backend database bindings, Row Level Security posture, and statutory SLA settings
        </p>
      </div>

      {/* Database Connection Status */}
      <GlassCard variant="elevated" className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Supabase & PostgreSQL Binding
              </h2>
              <p className="text-xs text-slate-400">
                {isSupabaseConfigured
                  ? 'Connected to live Supabase PostgreSQL backend'
                  : 'Running in Local Demonstration Mode with Seeded DPDP Fixtures'}
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
              isSupabaseConfigured
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30'
            }`}
          >
            {isSupabaseConfigured ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>SUPABASE ACTIVE</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5" />
                <span>DEMO STORE ACTIVE</span>
              </>
            )}
          </span>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
          <p>
            To bind a production Supabase instance, create a <code className="text-teal-500">.env</code> file in the project root with your credentials:
          </p>
          <pre className="p-3.5 rounded-xl bg-slate-100 dark:bg-midnight-950 text-[11px] font-mono text-slate-800 dark:text-teal-300 border border-slate-200 dark:border-white/10">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...`}
          </pre>
          <p className="text-[11px] text-slate-400">
            Database schema and RLS policies are located in <code className="text-teal-500">supabase/migrations/20261011_privacyguard_schema.sql</code>.
          </p>
        </div>
      </GlassCard>

      {/* Security & RLS Posture */}
      <GlassCard variant="default" className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-500" />
          <span>Security & RLS Defense Configuration</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-midnight-950/60 border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Row Level Security (RLS)</div>
              <div className="text-[11px] text-slate-400">Enforced on deletion_requests, jobs, retentions, and audit tables</div>
            </div>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">ENFORCED</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-midnight-950/60 border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">CWE-1236 Formula Injection Neutralization</div>
              <div className="text-[11px] text-slate-400">Neutralizes =, +, -, @ triggers during CSV export generation</div>
            </div>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">ACTIVE</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-midnight-950/60 border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Append-Only Audit Policy</div>
              <div className="text-[11px] text-slate-400">Direct client UPDATE and DELETE operations permanently revoked</div>
            </div>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">REVOKED</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
