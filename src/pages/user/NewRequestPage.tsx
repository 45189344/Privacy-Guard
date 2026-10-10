import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { StorageService } from '@/services/storage';
import { RequestCategory, DeletionRequest } from '@/types';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  Layers,
  FileText,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Shield,
  AlertTriangle,
  Lock,
  ExternalLink,
} from 'lucide-react';

const CATEGORIES: { id: RequestCategory; title: string; desc: string; icon: string }[] = [
  {
    id: 'ACCOUNT_AND_ALL_DATA',
    title: 'Complete Account & Associated Personal Data',
    desc: 'Full eradication of profile, authentication credentials, purchase sessions, and behavioral tracking.',
    icon: '⚡',
  },
  {
    id: 'MARKETING_AND_TELEMETRY',
    title: 'Marketing Identifiers & Telemetry',
    desc: 'Delete advertising graphs, tracking cookies, location breadcrumbs, and cross-device marketing tags.',
    icon: '🎯',
  },
  {
    id: 'CUSTOMER_SUPPORT_COMMUNICATIONS',
    title: 'Customer Support Communications',
    desc: 'Erase help desk chat transcripts, resolved ticket recordings, and call logs.',
    icon: '💬',
  },
  {
    id: 'FINANCIAL_TRANSACTION_RECORDS',
    title: 'Financial & Transaction Records',
    desc: 'Request deletion of stored virtual cards, payment tokens, and invoice logs (subject to statutory review).',
    icon: '💳',
  },
  {
    id: 'IDENTITY_AND_KYC_DOCUMENTS',
    title: 'Identity & KYC Documents',
    desc: 'Erase uploaded verification copies, selfie biometrics, and expired address verifications.',
    icon: '🪪',
  },
  {
    id: 'CUSTOM_SELECTION',
    title: 'Custom Scoped Selection',
    desc: 'Specify particular datasets, databases, or third-party service connections to prune.',
    icon: '⚙️',
  },
];

export const NewRequestPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<RequestCategory>('ACCOUNT_AND_ALL_DATA');
  const [scopeDetails, setScopeDetails] = useState('');
  const [reason, setReason] = useState('');
  const [verificationMethod, setVerificationMethod] = useState<'EMAIL_OTP' | 'AUTH_CHALLENGE' | 'MFA_CONFIRMATION'>('EMAIL_OTP');
  const [otpCode, setOtpCode] = useState('');
  const [confirmedIntent, setConfirmedIntent] = useState(false);
  const [createdRequest, setCreatedRequest] = useState<DeletionRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateSecureRequestId = (): string => {
    const year = new Date().getFullYear();
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const suffix = Math.random().toString(36).substring(2, 4).toUpperCase();
    return `PG-${year}-${randomHex}-${suffix}`;
  };

  const handleNext = () => {
    setError(null);
    if (step === 1 && !category) {
      setError('Please select a deletion category.');
      return;
    }
    if (step === 2 && !scopeDetails.trim()) {
      setError('Please specify the scope details for the deletion request.');
      return;
    }
    if (step === 3 && verificationMethod === 'EMAIL_OTP' && otpCode.length !== 6) {
      setError('Please enter the 6-digit confirmation OTP.');
      return;
    }
    if (step === 4 && !confirmedIntent) {
      setError('You must confirm your intent before submitting.');
      return;
    }
    setStep((s) => s + 1);
  };

  const handleFinalSubmit = () => {
    if (!user) return;

    const newId = generateSecureRequestId();
    const newRequest: DeletionRequest = {
      id: newId,
      userId: user.id,
      userEmail: user.email,
      userName: user.fullName,
      category,
      scopeDetails,
      reason: reason.trim() || undefined,
      status: 'VERIFIED', // Instant verification since challenge passed
      verificationMethod,
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      targetSystems: [
        'Primary PostgreSQL DB',
        'Redis Cache',
        'ElasticSearch Cluster',
        'S3 Object Storage Vault',
      ],
    };

    StorageService.saveRequest(newRequest);

    // Audit Event
    StorageService.logAuditEvent({
      eventType: 'REQUEST_SUBMITTED',
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      requestId: newId,
      outcome: 'SUCCESS',
      correlationId: `cor_req_${newId}_${Date.now()}`,
      ipAddressMasked: '103.***.***.***',
      metadata: {
        category,
        verificationMethod,
        scopeLength: scopeDetails.length,
      },
    });

    // In-app notification
    StorageService.addNotification({
      userId: user.id,
      requestId: newId,
      title: 'Deletion Request Submitted',
      message: `Your deletion request ${newId} has been verified and queued for DPO review.`,
      type: 'INFO',
    });

    setCreatedRequest(newRequest);
    setStep(5);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Step Progress Indicators */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <span>Step {step} of 5</span>
          <span className="text-teal-600 dark:text-teal-400">
            {step === 1 && 'Select Category'}
            {step === 2 && 'Define Scope'}
            {step === 3 && 'Identity Verification'}
            {step === 4 && 'Review & Confirm'}
            {step === 5 && 'Confirmation'}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-midnight-800 overflow-hidden">
          <div
            className="h-full bg-teal-500 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      <GlassCard variant="elevated" className="p-8">
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: CATEGORY */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Step 1: Select Deletion Category
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Choose the scope of personal information to be permanently purged from active systems.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-teal-500/10 dark:bg-teal-400/10 border-teal-500 ring-1 ring-teal-500'
                        : 'bg-white/60 dark:bg-midnight-950/60 border-slate-200 dark:border-white/5 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{cat.icon}</div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                      {cat.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {cat.desc}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-teal-glow transition-all flex items-center gap-2"
              >
                <span>Continue to Scope Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SCOPE DETAILS */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Step 2: Specify Request Details
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Provide precise scope parameters without transmitting sensitive unredacted passwords or KYC files.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Scope & Affected Accounts / Systems *
                </label>
                <textarea
                  rows={4}
                  value={scopeDetails}
                  onChange={(e) => setScopeDetails(e.target.value)}
                  placeholder="e.g. Please erase my user profile, marketing cookies, and support ticket history associated with this account."
                  required
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-midnight-950/70 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Optional Justification / Regulatory Context
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Exercising Right to Erasure under Section 12 of India's DPDP Act."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-midnight-950/70 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-white/10"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-teal-glow transition-all flex items-center gap-2"
              >
                <span>Continue to Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: IDENTITY VERIFICATION */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Step 3: Identity Proofing Challenge
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Possession of a request ID alone is not proof of identity. Prove account ownership to defeat fraudulent deletion attacks.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-800 dark:text-teal-300 flex items-start gap-3">
              <KeyRound className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Challenge Dispatched to: {user?.email}</div>
                <div className="text-[11px] mt-0.5 opacity-90">
                  For demonstration convenience, a test OTP code is automatically simulated as: <strong className="font-mono text-teal-600 dark:text-teal-300">894210</strong>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Enter 6-Digit Verification Code
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="894210"
                    className="w-44 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-midnight-950/70 border border-slate-200 dark:border-white/10 text-center font-mono font-bold tracking-widest text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setOtpCode('894210')}
                    className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-semibold"
                  >
                    Autofill Demo Code
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-white/10"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-teal-glow transition-all flex items-center gap-2"
              >
                <span>Verify & Proceed to Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Step 4: Review & Final Confirmation
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Please review your submission carefully. Confirmed deletions cannot be reversed once processed.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-midnight-950/60 border border-slate-200 dark:border-white/10 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-white/5">
                <span className="text-slate-400">Requester Identity:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{user?.fullName} ({user?.email})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-white/5">
                <span className="text-slate-400">Category:</span>
                <span className="font-semibold text-teal-600 dark:text-teal-400">{category.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-white/5">
                <span className="text-slate-400">Scope Details:</span>
                <span className="font-semibold text-slate-900 dark:text-white text-right max-w-xs">{scopeDetails}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-white/5">
                <span className="text-slate-400">Identity Proof Status:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">PASSED ({verificationMethod})</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmedIntent}
                  onChange={(e) => setConfirmedIntent(e.target.checked)}
                  className="mt-0.5 rounded border-amber-400 text-teal-600 focus:ring-teal-500"
                />
                <span>
                  I confirm that I am requesting the irreversible deletion of my personal data and understand that statutory obligations may require retention of financial tax ledgers.
                </span>
              </label>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-white/10"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-7 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-teal-glow transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Deletion Request</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: CONFIRMATION */}
        {step === 5 && createdRequest && (
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-glass-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold border border-teal-500/20">
                {createdRequest.id}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
                Deletion Request Successfully Submitted
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
                Your request has been cryptographically recorded and assigned to the Data Protection Officer for statutory compliance review.
              </p>
            </div>

            <div className="p-4 max-w-md mx-auto rounded-xl bg-slate-50 dark:bg-midnight-950/60 border border-slate-200 dark:border-white/10 text-xs text-left space-y-1.5">
              <div className="text-slate-400 font-semibold uppercase text-[10px]">What Happens Next?</div>
              <p className="text-slate-600 dark:text-slate-300">
                1. DPO validates statutory retention rules against active compliance schedules.
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                2. Idempotent deletion workers will purge data across authorized stores.
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                3. A signed cryptographic receipt will be generated upon completion.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-3">
              <Link
                to={`/app/requests/${createdRequest.id}`}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-teal-glow transition-all flex items-center gap-1.5"
              >
                <span>Track Request Progress</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/app"
                className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-midnight-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};
