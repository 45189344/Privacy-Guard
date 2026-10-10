import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { RequestStatus } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  FilePlus,
  ShieldCheck,
  CheckCircle,
  FileSearch,
  CheckSquare,
  RefreshCw,
  Award,
  AlertTriangle,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface LifecycleStep {
  status: RequestStatus;
  title: string;
  actor: string;
  description: string;
  details: string[];
  icon: any;
}

const LIFECYCLE_STEPS: LifecycleStep[] = [
  {
    status: 'SUBMITTED',
    title: '1. Request Intake & Cryptographic Nonce',
    actor: 'Data Principal',
    description: 'The requester chooses the deletion scope and submits justification. A non-guessable reference code (e.g., PG-2026-8942-X7) is issued.',
    details: [
      'Input validation & sanitization via Zod schema',
      'Anti-enumeration rate limiting on creation endpoints',
      'Initial unverified audit entry stamped with correlation ID',
    ],
    icon: FilePlus,
  },
  {
    status: 'VERIFICATION_PENDING',
    title: '2. Identity Proofing & Authorization Challenge',
    actor: 'Data Principal',
    description: 'Possession of a request ID does NOT prove identity. The user must authenticate via registered email OTP or MFA challenge.',
    details: [
      'Cryptographically random OTP with short 10-minute expiry',
      'Protection against automated brute-force verification',
      'Unverified requests cannot proceed to administrative evaluation',
    ],
    icon: ShieldCheck,
  },
  {
    status: 'UNDER_REVIEW',
    title: '3. Data Protection Officer (DPO) Evaluation',
    actor: 'Authorized DPO',
    description: 'An authorized DPO checks if the data is subject to mandatory regulatory retention (e.g. tax laws, active litigation, loan agreements).',
    details: [
      'Four-eyes principle: Administrators cannot self-approve personal requests',
      'Documented statutory basis required if retention exception is raised',
      'Can request additional clarification if details are ambiguous',
    ],
    icon: FileSearch,
  },
  {
    status: 'APPROVED',
    title: '4. Executive Approval & Store Mapping',
    actor: 'DPO / Automated Policy Engine',
    description: 'Eligible data categories are approved for deletion. Target storage systems (relational DBs, caches, search indexes, S3) are mapped.',
    details: [
      'Separation of Approval from Execution: Approval queues jobs, not direct destruction',
      'Idempotent job references generated for each data silo',
      'Principals receive in-app notification of approval',
    ],
    icon: CheckSquare,
  },
  {
    status: 'DELETION_IN_PROGRESS',
    title: '5. Distributed Deletion Execution',
    actor: 'Automated Deletion Workers',
    description: 'Background workers execute hard deletion, cryptographic key erasure, or anonymization across each storage subsystem.',
    details: [
      'Safe exponential backoff retries on transient connection timeouts',
      'Tombstone records preserve deletion provenance without leaking PII',
      'Individual store failures trigger partial failure queues rather than false success',
    ],
    icon: RefreshCw,
  },
  {
    status: 'COMPLETED',
    title: '6. Cryptographic Proof & Final Verification',
    actor: 'Automated Auditor & Cryptographic Verifier',
    description: 'Full completion is only recorded once all target storage confirmation hashes are mathematically validated.',
    details: [
      'Signed SHA-256 certificate of erasure available for requester download',
      'If statutory retention applied, outcome is accurately marked PARTIALLY_COMPLETED',
      'Tamper-evident append-only audit record permanently archived',
    ],
    icon: Award,
  },
];

export const HowItWorksPage: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<number>(0);
  const active = LIFECYCLE_STEPS[selectedStep];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold mb-3">
          <span>Deterministic State Machine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How PrivacyGuard Processes Deletion
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
          A transparent, six-phase lifecycle designed to guarantee accountability, prevent accidental data destruction, and uphold statutory compliance.
        </p>
      </div>

      {/* Interactive Step Navigator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Timeline List */}
        <div className="lg:col-span-5 space-y-3">
          {LIFECYCLE_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = idx === selectedStep;
            return (
              <div
                key={idx}
                onClick={() => setSelectedStep(idx)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-teal-500/10 dark:bg-teal-400/10 border-teal-500/40 shadow-sm'
                    : 'bg-white/60 dark:bg-midnight-900/40 border-slate-200/60 dark:border-white/5 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isCurrent ? 'text-teal-500' : 'text-slate-400'}`} />
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {step.title}
                    </span>
                  </div>
                  <StatusBadge status={step.status} size="sm" pulse={isCurrent} />
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>Actor: {step.actor}</span>
                  {isCurrent && <ArrowRight className="w-3.5 h-3.5 text-teal-500" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Step Deep Dive */}
        <div className="lg:col-span-7">
          <GlassCard variant="elevated" className="p-8 sticky top-24">
            <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-white/10">
              <div>
                <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                  Phase Details
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {active.title}
                </h2>
              </div>
              <StatusBadge status={active.status} size="md" />
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Phase Overview
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                  {active.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Architectural Safeguards
                </h4>
                <ul className="mt-2 space-y-2">
                  {active.details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-start text-xs text-slate-600 dark:text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-2.5 mt-1.5 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-midnight-950/60 border border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-500">Responsible Role:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{active.actor}</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 flex justify-between items-center">
              <button
                type="button"
                disabled={selectedStep === 0}
                onClick={() => setSelectedStep((s) => s - 1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-white/10 disabled:opacity-40"
              >
                Previous Phase
              </button>
              <button
                type="button"
                disabled={selectedStep === LIFECYCLE_STEPS.length - 1}
                onClick={() => setSelectedStep((s) => s + 1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white disabled:opacity-40"
              >
                Next Phase
              </button>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Side Branch Explanations */}
      <div className="mt-20">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Handling Exceptions & Alternate State Branches
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard variant="default" className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Statutory Retention (Partial)
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              When laws mandate financial or tax record retention, eligible data is deleted while retained records are pseudonymized with an auditable legal hold basis.
            </p>
          </GlassCard>

          <GlassCard variant="default" className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="w-5 h-5 text-rose-500" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Legitimate Rejections
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Requests conflicting with active legal obligations or unverified identities are rejected with explicit, transparent rationale recorded in the audit trail.
            </p>
          </GlassCard>

          <GlassCard variant="default" className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <RefreshCw className="w-5 h-5 text-sky-500" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Transient Worker Failures
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              If a data warehouse or cache partition times out, the specific job is safely queued for exponential backoff retries without corrupting sibling store results.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
