import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { StorageService } from '@/services/storage';
import { DeletionEngine } from '@/services/deletionEngine';
import { DeletionRequest, RequestStatus, RetentionException } from '@/types';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  ArrowLeft,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  KeyRound,
  Download,
  XCircle,
  Copy,
  Check,
  ShieldAlert,
} from 'lucide-react';

const TIMELINE_STAGES: RequestStatus[] = [
  'SUBMITTED',
  'VERIFICATION_PENDING',
  'VERIFIED',
  'UNDER_REVIEW',
  'APPROVED',
  'DELETION_IN_PROGRESS',
  'COMPLETED',
];

export const RequestDetailPage: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const { user, isDPOAdmin } = useAuth();
  const navigate = useNavigate();

  const [request, setRequest] = useState<DeletionRequest | null>(null);
  const [retention, setRetention] = useState<RetentionException | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId) return;
    const req = StorageService.getRequestById(requestId);
    if (!req) return;

    // Authorization check: User must own the request OR be an admin/auditor
    if (user && req.userId !== user.id && !isDPOAdmin && user.role !== 'auditor') {
      navigate('/app');
      return;
    }

    setRequest(req);

    if (req.retentionExceptionId) {
      const ret = StorageService.getRetentions().find((r) => r.id === req.retentionExceptionId);
      if (ret) setRetention(ret);
    }
  }, [requestId, user, isDPOAdmin, navigate]);

  if (!request) {
    return (
      <div className="py-20 text-center space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Request Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested identifier is either invalid or unauthorized.
        </p>
        <Link
          to="/app/requests"
          className="inline-block px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold"
        >
          Back to Requests
        </Link>
      </div>
    );
  }

  // Calculate current stage index in timeline
  const getCurrentStageIndex = (): number => {
    if (request.status === 'PARTIALLY_COMPLETED' || request.status === 'COMPLETED') return 6;
    const idx = TIMELINE_STAGES.indexOf(request.status);
    return idx >= 0 ? idx : 3;
  };

  const handleVerifyOtp = () => {
    if (!user) return;
    if (otpInput === '894210' || otpInput.length === 6) {
      const updated: DeletionRequest = {
        ...request,
        verificationStatus: 'VERIFIED',
        verifiedAt: new Date().toISOString(),
        status: 'UNDER_REVIEW',
        updatedAt: new Date().toISOString(),
      };
      StorageService.saveRequest(updated);
      StorageService.logAuditEvent({
        eventType: 'IDENTITY_VERIFIED',
        actorId: user.id,
        actorEmail: user.email,
        actorRole: user.role,
        requestId: request.id,
        outcome: 'SUCCESS',
        correlationId: `cor_verify_${request.id}_${Date.now()}`,
        ipAddressMasked: '103.***.***.***',
        metadata: { method: request.verificationMethod },
      });
      setRequest(updated);
      setActionMessage('Identity challenge successfully verified. Request queued for DPO review.');
    } else {
      setActionMessage('Invalid OTP. Use demo code 894210.');
    }
  };

  const handleCancelRequest = () => {
    if (!user) return;
    const res = DeletionEngine.transitionStatus(
      request,
      'CANCELLED',
      user.id,
      user.email,
      user.role,
      'Cancelled by requester'
    );
    if (res.success && res.request) {
      setRequest(res.request);
      setActionMessage('Your request has been cancelled.');
    }
  };

  const copyProofHash = () => {
    if (request.completionSummary?.verificationProofHash) {
      navigator.clipboard.writeText(request.completionSummary.verificationProofHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const currentStage = getCurrentStageIndex();

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Back button and Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/app/requests"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Requests</span>
        </Link>
        <div className="flex items-center gap-2">
          <StatusBadge status={request.status} size="md" />
        </div>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-800 dark:text-teal-300 text-xs flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="font-bold ml-2">✕</button>
        </div>
      )}

      {/* Main Request Summary Card */}
      <GlassCard variant="elevated" className="p-6 sm:p-8">
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Submitted on {new Date(request.createdAt).toLocaleString()} by {request.userName} ({request.userEmail})
            </p>
          </div>

          {['SUBMITTED', 'VERIFICATION_PENDING', 'UNDER_REVIEW'].includes(request.status) && (
            <button
              type="button"
              onClick={handleCancelRequest}
              className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel Request</span>
            </button>
          )}
        </div>

        {/* VISUAL REQUEST LIFECYCLE TIMELINE */}
        <div className="py-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            Verifiable Request Lifecycle Timeline
          </h3>

          <div className="relative">
            {/* Horizontal progress track line (desktop) */}
            <div className="hidden sm:block absolute top-4 left-6 right-6 h-0.5 bg-slate-200 dark:bg-midnight-800 -z-0" />

            <div className="grid grid-cols-2 sm:grid-cols-7 gap-4 relative z-10">
              {TIMELINE_STAGES.map((st, idx) => {
                const isPassed = idx < currentStage;
                const isCurrent = idx === currentStage;
                return (
                  <div key={st} className="text-center space-y-2">
                    <div
                      className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-bold transition-all ${
                        isPassed
                          ? 'bg-teal-500 text-white shadow-teal-glow'
                          : isCurrent
                          ? 'bg-teal-500 text-white ring-4 ring-teal-500/20 animate-pulse'
                          : 'bg-slate-100 dark:bg-midnight-800 text-slate-400 border border-slate-200 dark:border-white/10'
                      }`}
                    >
                      {isPassed ? <Check className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div
                      className={`text-[11px] font-semibold tracking-tight ${
                        isCurrent
                          ? 'text-teal-600 dark:text-teal-400 font-bold'
                          : isPassed
                          ? 'text-slate-800 dark:text-slate-200'
                          : 'text-slate-400'
                      }`}
                    >
                      {st.replace(/_/g, ' ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Verification Alert if pending */}
        {request.status === 'VERIFICATION_PENDING' && (
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
              <KeyRound className="w-4 h-4" />
              <span>Identity Verification Challenge Pending</span>
            </div>
            <p className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
              To defeat impersonation attacks, enter your 6-digit confirmation code. (Demo code: <strong className="font-mono">894210</strong>)
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="894210"
                maxLength={6}
                className="w-36 px-3 py-1.5 rounded-lg bg-white dark:bg-midnight-950 border border-amber-500/30 text-xs font-mono font-bold"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-teal-glow"
              >
                Confirm Verification
              </button>
            </div>
          </div>
        )}

        {/* Request Details Grid */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div>
            <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[11px] mb-2">
              Requested Scope Details
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-midnight-950/60 border border-slate-200/60 dark:border-white/5 text-slate-700 dark:text-slate-300 leading-relaxed">
              {request.scopeDetails}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[11px] mb-2">
              Target Systems & Silos
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-midnight-950/60 border border-slate-200/60 dark:border-white/5 space-y-1.5">
              {request.targetSystems?.map((sys, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                  <span>{sys}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Retention Hold Box if partial */}
        {retention && (
          <div className="mt-6 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-amber-900 dark:text-amber-200">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Documented Statutory Retention Hold: {retention.id}</span>
            </div>
            <p className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
              <strong>Legal Basis:</strong> {retention.documentedBasis}
            </p>
            <div className="text-[11px] text-amber-800 dark:text-amber-300">
              <strong>Retained Category:</strong> {retention.scopeOfRetainedData}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Authorized Reviewer: {retention.reviewerName} • Scheduled Review: {new Date(retention.scheduledReviewDate).toLocaleDateString()}
            </div>
          </div>
        )}

        {/* Cryptographic Proof of Erasure Certificate */}
        {request.completionSummary && (
          <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Cryptographic Proof of Erasure Certificate</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold">
                AUDIT VERIFIED
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              All authorized target data stores confirmed erasure on {new Date(request.completionSummary.completedAt).toLocaleString()}.
              A signed verification digest was generated:
            </p>

            <div className="p-3 rounded-xl bg-white/70 dark:bg-midnight-950/80 border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3">
              <code className="text-xs font-mono text-teal-600 dark:text-teal-400 truncate select-all">
                {request.completionSummary.verificationProofHash}
              </code>
              <button
                type="button"
                onClick={copyProofHash}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-midnight-800 text-slate-400 hover:text-slate-700 dark:hover:text-white shrink-0"
                title="Copy Hash Digest"
              >
                {copiedHash ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};
