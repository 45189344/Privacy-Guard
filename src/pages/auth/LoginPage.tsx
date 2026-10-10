import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { Shield, Lock, Mail, Eye, EyeOff, Loader2, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isDemoMode, isDPOAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || (isDPOAdmin ? '/admin' : '/app');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide a valid email address.');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('DemoSecuredPassword2026!');
    setLoading(true);
    setError(null);
    const result = await login(demoEmail, 'DemoSecuredPassword2026!');
    setLoading(false);
    if (result.success) {
      navigate(demoEmail.includes('dpo') ? '/admin' : '/app', { replace: true });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-400 text-white shadow-teal-glow mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Sign In to PrivacyGuard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access your data deletion requests & verified audit logs
          </p>
        </div>

        <GlassCard variant="elevated" className="p-8 sm:p-9">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-midnight-950/70 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-midnight-950/70 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-teal-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Autofill Shortcuts */}
          {isDemoMode && (
            <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-white/10 space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
                Quick Demonstration Access
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('priya.sharma@example.com')}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-midnight-950/60 hover:bg-teal-500/10 text-left border border-slate-200 dark:border-white/5 transition-all text-[11px]"
                >
                  <div className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                    <UserCheck className="w-3 h-3 text-teal-500" /> Priya S.
                  </div>
                  <div className="text-[10px] text-slate-400">Regular User</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('dpo.vikram@privacyguard.internal')}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-midnight-950/60 hover:bg-teal-500/10 text-left border border-slate-200 dark:border-white/5 transition-all text-[11px]"
                >
                  <div className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                    <ShieldCheck className="w-3 h-3 text-teal-500" /> Dr. Vikram
                  </div>
                  <div className="text-[10px] text-slate-400">DPO Admin</div>
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Do not have an account?{' '}
            <Link to="/register" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">
              Create an Account
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
