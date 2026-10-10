import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { RetentionException } from '@/types';
import { GlassCard } from '@/components/ui/GlassCard';
import { Archive, ShieldAlert, FileText, Calendar, ExternalLink } from 'lucide-react';

export const RetentionManagementPage: React.FC = () => {
  const [retentions, setRetentions] = useState<RetentionException[]>([]);

  useEffect(() => {
    setRetentions(StorageService.getRetentions());
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Statutory Retention Exceptions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Documented legal holds and statutory compliance registries under DPDP Act 2023 Section 8(7)
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Workflow Governance Notice:</strong> Documented retention exceptions prevent accidental violation of tax or financial laws (such as the Indian Income Tax Act 1961 Section 44AA). Retention must be limited exclusively to necessary statutory records while ancillary personal data is severed.
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {retentions.length === 0 ? (
          <GlassCard variant="default" className="p-12 text-center text-xs text-slate-400">
            No retention exceptions recorded at this time.
          </GlassCard>
        ) : (
          retentions.map((item) => (
            <GlassCard key={item.id} variant="elevated" className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-amber-600 dark:text-amber-400">
                      {item.id}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-midnight-800 text-slate-600 dark:text-slate-300 font-semibold">
                      Parent: {item.requestId}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold">
                      {item.finalDisposition}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {item.affectedDataCategory}
                  </h3>
                </div>

                <Link
                  to={`/admin/requests/${item.requestId}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-300 hover:bg-teal-500/20 text-xs font-semibold transition-colors"
                >
                  <span>View Parent Request</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider mb-1">
                    Statutory Legal Basis
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-midnight-950/60 border border-slate-200/60 dark:border-white/5 text-slate-700 dark:text-slate-300">
                    {item.documentedBasis}
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider mb-1">
                    Scope of Retained Records
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-midnight-950/60 border border-slate-200/60 dark:border-white/5 text-slate-700 dark:text-slate-300">
                    {item.scopeOfRetainedData}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-white/5 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                <span>Authorized Reviewer: <strong>{item.reviewerName}</strong></span>
                <span>Decision Timestamp: {new Date(item.decisionTimestamp).toLocaleString()}</span>
                <span>Scheduled Review Date: <strong className="text-slate-700 dark:text-slate-200">{new Date(item.scheduledReviewDate).toLocaleDateString()}</strong></span>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
};
