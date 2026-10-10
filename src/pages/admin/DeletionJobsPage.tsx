import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { StorageService } from '@/services/storage';
import { DeletionEngine } from '@/services/deletionEngine';
import { DeletionJob } from '@/types';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Play,
  Database,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export const DeletionJobsPage: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<DeletionJob[]>([]);
  const [runningJobId, setRunningJobId] = useState<string | null>(null);

  const refreshJobs = () => {
    setJobs(StorageService.getJobs());
  };

  useEffect(() => {
    refreshJobs();
  }, []);

  const handleRunJob = async (job: DeletionJob) => {
    if (!user) return;
    setRunningJobId(job.id);
    await DeletionEngine.executeJob(job, user.id, user.email, user.role);
    setRunningJobId(null);
    refreshJobs();
  };

  const handleRunAllPending = async () => {
    if (!user) return;
    const pendingJobs = jobs.filter(
      (j) => j.executionState === 'PENDING' || j.executionState === 'RETRY_REQUIRED'
    );
    for (const j of pendingJobs) {
      setRunningJobId(j.id);
      await DeletionEngine.executeJob(j, user.id, user.email, user.role);
    }
    setRunningJobId(null);
    refreshJobs();
  };

  const total = jobs.length;
  const successful = jobs.filter((j) => j.executionState === 'SUCCESS').length;
  const inProgress = jobs.filter((j) => j.executionState === 'RUNNING').length;
  const retries = jobs.filter((j) => j.executionState === 'RETRY_REQUIRED' || j.executionState === 'FAILED').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Deletion Processing Engine
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage distributed idempotent deletion jobs across relational databases, object storage, and search clusters
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refreshJobs}
            className="p-2 rounded-xl bg-white dark:bg-midnight-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-teal-500 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRunAllPending}
            disabled={Boolean(runningJobId)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-teal-glow transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Execute All Pending Jobs</span>
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <GlassCard variant="default" className="p-4">
          <div className="text-xs text-slate-400 font-semibold">Total Storage Jobs</div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">{total}</div>
        </GlassCard>
        <GlassCard variant="default" className="p-4">
          <div className="text-xs text-emerald-500 font-semibold">Purged & Verified</div>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">{successful}</div>
        </GlassCard>
        <GlassCard variant="default" className="p-4">
          <div className="text-xs text-sky-500 font-semibold">In Execution</div>
          <div className="text-xl font-bold font-mono text-sky-600 dark:text-sky-400 mt-1">{inProgress}</div>
        </GlassCard>
        <GlassCard variant="default" className="p-4">
          <div className="text-xs text-amber-500 font-semibold">Retries / Faults</div>
          <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">{retries}</div>
        </GlassCard>
      </div>

      {/* Jobs Table */}
      <GlassCard variant="elevated" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-midnight-950/50 text-slate-400 font-semibold">
                <th className="py-3 px-4">Job Reference</th>
                <th className="py-3 px-4">Parent Request</th>
                <th className="py-3 px-4">Target Silo</th>
                <th className="py-3 px-4">Operation Type</th>
                <th className="py-3 px-4">Attempts</th>
                <th className="py-3 px-4">Execution State</th>
                <th className="py-3 px-4">Verification Hash</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-600 dark:text-slate-300">
              {jobs.map((job) => {
                const isRunning = runningJobId === job.id;
                return (
                  <tr key={job.id} className="hover:bg-slate-50/50 dark:hover:bg-midnight-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {job.id}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-teal-600 dark:text-teal-400">
                      <Link to={`/admin/requests/${job.requestId}`} className="hover:underline">
                        {job.requestId}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {job.targetSystem}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      {job.operationType}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {job.attemptCount}/{job.maxAttempts}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={job.executionState} size="sm" pulse={isRunning} />
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] truncate max-w-[140px] text-slate-400">
                      {job.verificationResult?.hash || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {job.executionState !== 'SUCCESS' ? (
                        <button
                          type="button"
                          onClick={() => handleRunJob(job)}
                          disabled={Boolean(runningJobId)}
                          className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-[11px] shadow-sm disabled:opacity-50"
                        >
                          {isRunning ? 'Processing...' : job.executionState === 'RETRY_REQUIRED' ? 'Retry Job' : 'Execute'}
                        </button>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
