import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Shield, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UserPrivacyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Your Privacy Rights (DPDP Act 2023)
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Summary of legal rights and controls guaranteed to you as a Data Principal
        </p>
      </div>

      <GlassCard variant="elevated" className="p-8 space-y-6">
        <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-midnight-950/60 border border-slate-200/60 dark:border-white/5 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-500" />
              <span>Right to Correction and Erasure of Personal Data (Section 12)</span>
            </h3>
            <p>
              You have the legal right to request the correction of inaccurate data, updating of incomplete records, and permanent deletion of data that is no longer required for its lawful purpose.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-midnight-950/60 border border-slate-200/60 dark:border-white/5 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-500" />
              <span>Right to Grievance Redressal (Section 13)</span>
            </h3>
            <p>
              If a deletion request is denied or subjected to statutory retention, you may contact our designated Data Protection Officer or escalate grievances to the Data Protection Board of India.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-midnight-950/60 border border-slate-200/60 dark:border-white/5 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-500" />
              <span>Right of Grievance Nomination (Section 14)</span>
            </h3>
            <p>
              In the event of physical disability or death, you can designate an authorized nominee to manage personal data requests on your behalf.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex justify-between items-center">
          <span className="text-xs text-slate-400">Privacy Fiduciary Contact: dpo@privacyguard.internal</span>
          <Link
            to="/app/requests/new"
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-teal-glow transition-all flex items-center gap-1.5"
          >
            <span>Submit Erasure Request</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};
