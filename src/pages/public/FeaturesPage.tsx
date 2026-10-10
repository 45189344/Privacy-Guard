import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  Shield,
  KeyRound,
  FileText,
  Clock,
  Archive,
  CheckCircle2,
  Lock,
  Layers,
  FileSpreadsheet,
  AlertOctagon,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FeaturesPage: React.FC = () => {
  const features = [
    {
      title: 'Granular Deletion Scopes',
      desc: 'Request complete account eradication or targeted removal of telemetry, chat histories, or payment identifiers without deleting your core identity.',
      icon: Layers,
      tag: 'DPDP Sec 12',
    },
    {
      title: 'Strong Identity Proofing',
      desc: 'Prevents fraudulent deletion attacks using email OTP, WebAuthn MFA, or authorization challenge tokens before any data mutation is queued.',
      icon: KeyRound,
      tag: 'Anti-Impersonation',
    },
    {
      title: 'Statutory Retention Holds',
      desc: 'Integrated management of legitimate retention obligations (e.g., tax, income reporting, AML compliance) under Section 8(7) DPDP.',
      icon: Archive,
      tag: 'Legal Balance',
    },
    {
      title: 'Distributed Deletion Engine',
      desc: 'Orchestrates deletion operations across disparate storage clusters: PostgreSQL, Redis, Elasticsearch, and S3 vaults with backoff retries.',
      icon: Clock,
      tag: 'Idempotent Workers',
    },
    {
      title: 'Cryptographic Erasure Proof',
      desc: 'Calculates signed SHA-256 hashes of store deletion confirmations to provide principals with a cryptographic certificate of erasure.',
      icon: CheckCircle2,
      tag: 'Verifiable Receipts',
    },
    {
      title: 'Formula-Safe Audit Export',
      desc: 'Authorized administrators can export audit trails to CSV with built-in defenses against CSV Formula Injection (CWE-1236).',
      icon: FileSpreadsheet,
      tag: 'CWE-1236 Defense',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold mb-3">
          <span>Enterprise Privacy Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Engineered for Total Lifecycle Assurance
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
          PrivacyGuard bridges the gap between individual privacy rights and complex enterprise infrastructure with verifiably audited data workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <GlassCard key={idx} variant="default" interactive className="p-7">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-midnight-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                  {feat.tag}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {feat.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {feat.desc}
              </p>
            </GlassCard>
          );
        })}
      </div>

      <div className="mt-16 text-center">
        <Link
          to="/app/requests/new"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm shadow-teal-glow transition-all"
        >
          Submit a Deletion Request Now
        </Link>
      </div>
    </div>
  );
};
