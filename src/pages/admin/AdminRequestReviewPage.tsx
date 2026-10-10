import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { StorageService } from '@/services/storage';
import { DeletionEngine } from '@/services/deletionEngine';
import { DeletionRequest, RequestStatus, RetentionException, DeletionJob } from '@/types';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  Archive,
  RefreshCw,
  FileText,
  User,
  ExternalLink,
} from 'lucide-react';

export const AdminRequestReviewPage: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [request, setRequest] = useState<DeletionRequest | null>(null);
  const [retention, setRetention] = useState<RetentionException | null>(null);
  const [jobs, setJobs] = useState<DeletionJob[]>([]);
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRetentionModalOpen, setIsRetentionModalOpen] = useState(false);
  const [retentionBasis, setRetentionBasis] = useState('');
  const [retentionScope, setRetentionScope] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = () => {
    if (!requestId) return;
    const req = StorageService.getRequestById(requestId);
    if (!req) return;
    setRequest(req);
    setJobs(StorageService.getJobsByRequestId(req.id));

    if (req.retentionExceptionId) {
      const ret = StorageService.getRetentions().find((r) => r.id === req.retentionExceptionId);
      if (ret) setRetention(ret);
    }
  };

  useEffect(() => {
    loadData();
  }, [requestId]);

  if (!request || !user) {
    return (
      <div className="py-20 text-center text-xs text-slate-400">
        Loading request or unauthorized...
      </div>
    );
  }

  // Handle DPO Approval
  const handleApprove = () => {
    const res = DeletionEngine.transitionStatus(
      request,
      'APPROVED',
      user.id,
      user.email,
      user.role,
      notes || 'Approved by DPO'
    );
    if (res.success && res.request) {
      setRequest(res.request);
      setFeedbackMsg({ type: 'success', text: 'Request approved. Ready to schedule deletion jobs.' });
    } else {
      setFeedbackMsg({ type: 'error', text: res.error || 'Approval failed' });
    }
  };

  // Dispatch Jobs and Start Execution
  const handleStartDeletionJobs = () => {
    const scheduled = DeletionEngine.scheduleJobsForRequest(
      request,
      user.id,
      user.email,
      user.role
    );
    const res = DeletionEngine.transitionStatus(
      request,
      'DELETION_IN_PROGRESS',
      user.id,
      user.email,
      user.role,
      'Deletion jobs dispatched across target clusters'
    );

    if (res.success && res.request) {
      setRequest(res.request);
      setJobs(scheduled);
      setFeedbackMsg({
        type: 'success',
        text: `Dispatched ${scheduled.length} deletion jobs to target storage silos.`,
      });
    }
  };

  // Execute single job
  const handleRunJob = async (job: DeletionJob) => {
    setFeedbackMsg({ type: 'success', text: `Executing job ${job.id} on ${job.targetSystem}...` });
    await DeletionEngine.executeJob(job, user.id, user.email, user.role);
    loadData();
  };

  // Handle Rejection
  const handleReject = () => {
    if (!rejectionReason.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Mandatory statutory rejection rationale required.' });
      return;
    }
    const res = DeletionEngine.transitionStatus(
      request,
      'REJECTED',
      user.id,
      user.email,
      user.role,
      rejectionReason
    );
    if (res.success && res.request) {
      setRequest(res.request);
      setFeedbackMsg({ type: 'success', text: 'Request rejected with documented legal grounds.' });
    }
  };

  // Document Retention Exception Modal Submit
  const handleCreateRetention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!retentionBasis.trim() || !retentionScope.trim()) {
      setFeedbackMsg({ type: 'error', text: 'All retention hold fields must be specified.' });
      return;
    }

    const newRet = DeletionEngine.recordRetentionException(
      {
        requestId: request.id,
        affectedDataCategory: request.category.replace(/_/g, ' '),
        documentedBasis: retentionBasis,
        reviewerId: user.id,
        reviewerName: user.fullName,
        scopeOfRetainedData: retentionScope,
        scheduledReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 7).toISOString(),
        finalDisposition: 'PERMANENT_REGULATORY_ARCHIVE',
      },
      user.id,
      user.email,
      user.role
    );

    setRetention(newRet);
    setIsRetentionModalOpen(false);
    setFeedbackMsg({
      type: 'success',
      text: `Retention hold ${newRet.id} successfully attached to request under DPDP Section 8(7).`,
    });
    loadData();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Back and Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/admin/requests"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Operations Queue</span>
        </Link>
        <div className="flex items-center gap-2">
          <StatusBadge status={request.status} size="md" />
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-300'
          }`}
        >
          <span>{feedbackMsg.text}</span>
          <button onClick={() => setFeedbackMsg(null)} className="font-bold ml-2">✕</button>
        </div>
      )}

      {/* Main Review Card */}
      <GlassCard variant="elevated" className="p-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-extrabold text-teal-600 dark:text-teal-400">
                {request.id}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-midnight-800 text-slate-600 dark:text-slate-300 font-semibold border border-slate-200 dark:border-white/10">
                {request.category.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Data Principal: <strong>{request.userName}</strong> ({request.userEmail}) • Submitted: {new Date(request.createdAt).toLocaleString()}
            </div>
          </div>
          <div className="text-right text-xs">
            <div className="text-slate-400">Identity Verification</div>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{request.verificationStatus} ({request.verificationMethod})</span>
            </span>
          </div>
        </div>

        {/* Scope and Context */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div>
            <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[11px] mb-2">
              Requested Deletion Scope
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-midnight-950/60 border border-slate-200/60 dark:border-white/5 text-slate-700 dark:text-slate-300 leading-relaxed">
              {request.scopeDetails}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[11px] mb-2">
              Principal Justification
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-midnight-950/60 border border-slate-200/60 dark:border-white/5 text-slate-700 dark:text-slate-300 leading-relaxed">
              {request.reason || 'Standard DPDP Right to Erasure request.'}
            </div>
          </div>
        </div>

        {/* Retention Exception Details if present */}
        {retention ? (
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-amber-900 dark:text-amber-200">
              <Archive className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Active Statutory Retention Exception: {retention.id}</span>
            </div>
            <p className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
              <strong>Documented Legal Basis:</strong> {retention.documentedBasis}
            </p>
            <div className="text-[11px] text-amber-800 dark:text-amber-300">
              <strong>Retained Scope:</strong> {retention.scopeOfRetainedData}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-midnight-950/40 border border-slate-200/60 dark:border-white/5 text-xs">
            <span className="text-slate-500">Need to record statutory obligations (e.g. tax, audit hold)?</span>
            <button
              type="button"
              onClick={() => setIsRetentionModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold border border-amber-500/30 transition-colors flex items-center gap-1.5"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Document Retention Exception</span>
            </button>
          </div>
        )}

        {/* DPO Workflow Action Toolbar */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-midnight-950/80 border border-slate-200/80 dark:border-white/10 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            DPO Evaluation & Execution Controls
          </h3>

          {request.status === 'UNDER_REVIEW' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Compliance Review Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Identity verified. No pending legal holds detected."
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-midnight-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleApprove}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-teal-glow transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve for Deletion</span>
                </button>

                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Mandatory rejection rationale if denying..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-midnight-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleReject}
                    className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Request</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {request.status === 'APPROVED' && (
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-teal-600 dark:text-teal-400">
                  Ready for Deletion Processing
                </div>
                <div className="text-[11px] text-slate-400">
                  Approved by DPO. Dispatch deletion jobs across authorized storage silos.
                </div>
              </div>
              <button
                type="button"
                onClick={handleStartDeletionJobs}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-teal-glow transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Dispatch Deletion Workers</span>
              </button>
            </div>
          )}

          {request.status === 'DELETION_IN_PROGRESS' && (
            <div>
              <div className="text-xs font-bold text-sky-600 dark:text-sky-400 mb-3 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Deletion Workers Active Across Target Silos</span>
              </div>

              {/* Jobs Table */}
              <div className="space-y-2">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-3 rounded-xl bg-white/70 dark:bg-midnight-900/80 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{job.targetSystem}</span>
                        <span className="font-mono text-[10px] text-slate-400">({job.id})</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Type: {job.operationType} • Attempts: {job.attemptCount}/{job.maxAttempts}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusBadge status={job.executionState} size="sm" />
                      {job.executionState !== 'SUCCESS' && (
                        <button
                          type="button"
                          onClick={() => handleRunJob(job)}
                          className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-semibold"
                        >
                          Run / Retry
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(request.status === 'COMPLETED' || request.status === 'PARTIALLY_COMPLETED') && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>
                  {request.status === 'PARTIALLY_COMPLETED' ? 'Partially Completed with Retention' : 'Full Deletion Verified & Concluded'}
                </span>
              </div>
              <Link
                to={`/app/requests/${request.id}`}
                className="text-teal-600 dark:text-teal-400 hover:underline font-semibold flex items-center gap-1"
              >
                <span>View Verifiable Receipt</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Retention Exception Modal */}
      {isRetentionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-midnight-900 border border-slate-200 dark:border-white/10 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Archive className="w-4 h-4 text-amber-500" />
                <span>Document Statutory Retention Hold</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsRetentionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRetention} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Documented Statutory Basis (Legal Provision) *
                </label>
                <input
                  type="text"
                  value={retentionBasis}
                  onChange={(e) => setRetentionBasis(e.target.value)}
                  placeholder="e.g. DPDP Act 2023 Section 8(7) read with Indian Income Tax Act 1961 Section 44AA"
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-midnight-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Scope of Retained Records *
                </label>
                <textarea
                  rows={3}
                  value={retentionScope}
                  onChange={(e) => setRetentionScope(e.target.value)}
                  placeholder="e.g. GST invoices and payment transaction ledgers. All marketing telemetry severed."
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-midnight-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-900 dark:text-amber-200 text-[11px] leading-relaxed">
                Documenting a retention hold prevents inadvertent destruction of legally required compliance logs while allowing the remainder of the principal's data to be lawfully purged.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRetentionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold"
                >
                  Record Legal Hold
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
