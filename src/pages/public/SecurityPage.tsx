import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  ShieldCheck,
  Lock,
  Database,
  FileSpreadsheet,
  KeyRound,
  FileCheck2,
  AlertTriangle,
  Server,
  Layers,
} from 'lucide-react';

export const SecurityPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold mb-3">
          <span>Architectural Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Security Engineering & Defense-in-Depth
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
          We believe in honest, verifiable security architecture. Here is an exact breakdown of our threat models, controls, and defense implementations.
        </p>
      </div>

      {/* Core Defense Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <GlassCard variant="default" className="p-6">
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 w-fit mb-4">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            PostgreSQL Row Level Security (RLS)
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Every query against deletion requests, profile tokens, and job statuses is enforced at the database engine level via Supabase RLS. No client parameter tampering can bypass user tenancy boundaries.
          </p>
        </GlassCard>

        <GlassCard variant="default" className="p-6">
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 w-fit mb-4">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            No Frontend Authorization Trust
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Hiding buttons or routes in the browser is never treated as a security control. State transitions, retention holdings, and deletion job triggers require authenticated server-side role validation.
          </p>
        </GlassCard>

        <GlassCard variant="default" className="p-6">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit mb-4">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            CWE-1236 Formula Injection Neutralization
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Exported CSV files automatically sanitize leading formula triggers (<code className="text-teal-500">=, +, -, @, \t</code>) by prepending safe single quotes, protecting auditors from malicious spreadsheet macro executions.
          </p>
        </GlassCard>
      </div>

      {/* Threat Model Breakdown Table */}
      <GlassCard variant="elevated" className="p-8 mb-16">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Detailed Threat Model & Countermeasures
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-slate-400 font-semibold">
                <th className="py-3 px-4">Threat Vector</th>
                <th className="py-3 px-4">Impact Risk</th>
                <th className="py-3 px-4">Implemented Countermeasure</th>
                <th className="py-3 px-4">Residual Limitation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-600 dark:text-slate-300">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                  Cross-User Request Hijacking (IDOR)
                </td>
                <td className="py-3.5 px-4 text-rose-500 font-semibold">Critical</td>
                <td className="py-3.5 px-4">
                  Database RLS checks <code className="text-teal-500">auth.uid() = user_id</code>. Request IDs use secure high-entropy nonces.
                </td>
                <td className="py-3.5 px-4 text-slate-400">None in active sessions</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                  Privilege Escalation to Admin/DPO
                </td>
                <td className="py-3.5 px-4 text-rose-500 font-semibold">Critical</td>
                <td className="py-3.5 px-4">
                  Self-registration routes strictly enforce <code className="text-teal-500">role = 'user'</code>. Admin roles must be granted via trusted internal provisioning.
                </td>
                <td className="py-3.5 px-4 text-slate-400">Internal key management required</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                  Audit Trail Tampering
                </td>
                <td className="py-3.5 px-4 text-amber-500 font-semibold">High</td>
                <td className="py-3.5 px-4">
                  Append-only event schema. UPDATE and DELETE permissions revoked from audit tables even for administrative accounts.
                </td>
                <td className="py-3.5 px-4 text-slate-400">Database superuser access can alter raw disks</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                  Accidental / Premature Deletion
                </td>
                <td className="py-3.5 px-4 text-amber-500 font-semibold">High</td>
                <td className="py-3.5 px-4">
                  Approval is decoupled from execution. Idempotent background jobs require explicit multi-store verification checks.
                </td>
                <td className="py-3.5 px-4 text-slate-400">Worker timeouts trigger safe retry queues</td>
              </tr>
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Honest Limitations Notice */}
      <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Realistic Engineering Limitations Notice</span>
        </div>
        <p className="leading-relaxed">
          No system is impervious to attack. In compliance with DPDP principles, PrivacyGuard executes deletion across live production systems and replica indices. Encrypted cold disaster-recovery backups are not scrubbed immediately due to immutable physical media; instead, retention schedules ensure backup lifecycles expire and are overwritten within 30 to 90 days.
        </p>
      </div>
    </div>
  );
};
