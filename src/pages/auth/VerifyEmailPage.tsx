import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';
import { MailCheck, CheckCircle2, RefreshCw } from 'lucide-react';

export const VerifyEmailPage: React.FC = () => {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
      setResent(true);
    }, 1200);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <GlassCard variant="elevated" className="p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-2 border border-teal-500/20">
            <MailCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Verify Your Email
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            We have sent an authentication challenge to your registered email address. Please click the verification link to activate all data principal rights.
          </p>

          {resent && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs">
              Fresh verification link has been dispatched to your inbox.
            </div>
          )}

          <div className="pt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-midnight-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              <span>{resending ? 'Dispatching...' : 'Resend Verification Email'}</span>
            </button>
            <Link
              to="/login"
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
