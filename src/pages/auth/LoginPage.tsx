import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Fingerprint,
  Sparkles,
  CheckCircle2,
  KeyRound,
  ShieldAlert,
  Compass,
} from 'lucide-react';
import { OSWindowHeader } from '@/components/ui/OSWindowHeader';

export const LoginPage: React.FC = () => {
  const { login, isDemoMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Clock state for OS lock screen
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');

  // Form & Interaction states
  const [mode, setMode] = useState<'biometric' | 'password'>('biometric');
  const [selectedUser, setSelectedUser] = useState<'priya' | 'vikram' | 'sunita'>('priya');
  const [email, setEmail] = useState('priya.sharma@example.com');
  const [password, setPassword] = useState('DemoSecuredPassword2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoProfiles = {
    priya: {
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      role: 'Citizen User',
      badge: 'Data Principal',
      avatarColor: 'from-electric-teal to-cyan-500',
      destination: '/app',
    },
    vikram: {
      name: 'Dr. Vikram Malhotra',
      email: 'dpo.vikram@privacyguard.internal',
      role: 'DPO Administrator',
      badge: 'Admin Authority',
      avatarColor: 'from-emerald-neon to-teal-600',
      destination: '/admin',
    },
    sunita: {
      name: 'Sunita Rao',
      email: 'auditor.sunita@privacyguard.internal',
      role: 'Independent Auditor',
      badge: 'Compliance Officer',
      avatarColor: 'from-amber-400 to-electric-teal',
      destination: '/admin/audit',
    },
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setDate(
        now.toLocaleDateString([], {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update email when profile selection changes
  const handleSelectProfile = (key: 'priya' | 'vikram' | 'sunita') => {
    setSelectedUser(key);
    setEmail(demoProfiles[key].email);
    setPassword('DemoSecuredPassword2026!');
    setError(null);
  };

  const handleBiometricScan = async () => {
    setIsScanning(true);
    setError(null);

    // Haptic/visual scanning animation
    setTimeout(async () => {
      setScanSuccess(true);
      const target = demoProfiles[selectedUser];
      const result = await login(target.email, 'DemoSecuredPassword2026!');

      setTimeout(() => {
        setIsScanning(false);
        if (result.success) {
          const from = (location.state as any)?.from?.pathname || target.destination;
          navigate(from, { replace: true });
        } else {
          setScanSuccess(false);
          setError(result.error || 'Biometric identity challenge failed.');
        }
      }, 700);
    }, 1100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide a valid account email.');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      const isDPO = email.toLowerCase().includes('dpo') || email.toLowerCase().includes('admin');
      const from = (location.state as any)?.from?.pathname || (isDPO ? '/admin' : '/app');
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Authentication rejected. Verify credentials or use demo profile.');
    }
  };

  const activeProfile = demoProfiles[selectedUser];

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-between bg-midnight-975 text-white overflow-hidden py-6 px-4 selection:bg-electric-teal/30 selection:text-white">
      {/* Dynamic Animated Ambient Background Meshes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Electric Teal Aura Orb */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-electric-teal/15 blur-[120px] animate-pulse-gentle" />
        {/* Emerald Neon Aura Orb */}
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-emerald-neon/12 blur-[140px] animate-pulse-gentle" />
        {/* Midnight Blue Deep Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-midnight-800/25 blur-[160px] pointer-events-none" />
      </div>

      {/* Top OS Lock Screen Header */}
      <header className="relative z-10 text-center pt-2 sm:pt-4 select-none">
        {/* Lock Icon Indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-midnight-900/80 border border-electric-teal/25 text-electric-teal text-xs font-mono shadow-sm mb-3">
          <Lock className="w-3.5 h-3.5 text-electric-teal" />
          <span className="tracking-widest uppercase text-[11px]">Hardware Enclave Locked</span>
        </div>

        {/* Live Big OS Clock */}
        <div className="font-extrabold text-4xl sm:text-6xl tracking-tight text-white font-mono drop-shadow-[0_0_25px_rgba(0,245,255,0.25)]">
          {time || '00:00:00'}
        </div>
        <div className="text-xs sm:text-sm font-medium text-slate-400 mt-1 font-sans">
          {date || 'PrivacyGuard OS Enclave'}
        </div>
      </header>

      {/* Center OS Window Modal */}
      <main className="relative z-10 w-full max-w-lg my-6">
        <div className="relative rounded-2xl bg-midnight-950/85 backdrop-blur-3xl border border-electric-teal/30 shadow-os-window overflow-hidden">
          {/* OS Window Chrome Title Bar */}
          <OSWindowHeader
            title="PrivacyGuard Enclave"
            subtitle="Access Gate"
            badge="DPDP-2026-ENCLAVE"
          />

          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-shake">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Profile Avatar & Selector */}
            <div className="text-center mb-6">
              <div className="relative inline-block mb-3">
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${activeProfile.avatarColor} text-midnight-950 font-extrabold text-2xl flex items-center justify-center shadow-electric-glow transition-transform duration-300 hover:scale-105`}
                >
                  {activeProfile.name.charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-midnight-950 border border-electric-teal/40 text-emerald-neon">
                  <CheckCircle2 className="w-4 h-4 fill-emerald-neon/20" />
                </div>
              </div>

              <h2 className="text-lg font-bold text-white tracking-tight">
                {activeProfile.name}
              </h2>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-xs text-slate-400 font-mono">{activeProfile.email}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-electric-teal/15 text-electric-teal border border-electric-teal/30">
                  {activeProfile.badge}
                </span>
              </div>

              {/* Profile Picker Buttons */}
              <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => handleSelectProfile('priya')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedUser === 'priya'
                      ? 'bg-electric-teal text-midnight-950 shadow-electric-glow font-bold'
                      : 'bg-midnight-900/70 text-slate-300 hover:bg-midnight-800 border border-white/10'
                  }`}
                >
                  Priya (User)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectProfile('vikram')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedUser === 'vikram'
                      ? 'bg-emerald-neon text-midnight-950 shadow-emerald-glow font-bold'
                      : 'bg-midnight-900/70 text-slate-300 hover:bg-midnight-800 border border-white/10'
                  }`}
                >
                  Dr. Vikram (DPO)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectProfile('sunita')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedUser === 'sunita'
                      ? 'bg-amber-400 text-midnight-950 shadow-amber-glow font-bold'
                      : 'bg-midnight-900/70 text-slate-300 hover:bg-midnight-800 border border-white/10'
                  }`}
                >
                  Sunita (Auditor)
                </button>
              </div>
            </div>

            {/* Mode Switch Tabs: Biometric vs Password */}
            <div className="flex items-center p-1 rounded-xl bg-midnight-900/90 border border-white/10 mb-6 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMode('biometric')}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  mode === 'biometric'
                    ? 'bg-electric-teal text-midnight-950 shadow-electric-glow font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Fingerprint className="w-4 h-4" />
                <span>Touch ID / Passkey</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('password')}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  mode === 'password'
                    ? 'bg-electric-teal text-midnight-950 shadow-electric-glow font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Password / PIN</span>
              </button>
            </div>

            {/* Mode 1: Biometric Scanner */}
            {mode === 'biometric' && (
              <div className="space-y-4">
                <div
                  onClick={!isScanning ? handleBiometricScan : undefined}
                  className={`group relative p-8 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden ${
                    scanSuccess
                      ? 'bg-emerald-neon/15 border-emerald-neon shadow-emerald-glow'
                      : isScanning
                      ? 'bg-electric-teal/15 border-electric-teal shadow-electric-glow'
                      : 'bg-midnight-900/50 hover:bg-midnight-900/80 border-electric-teal/30 hover:border-electric-teal shadow-glass-md'
                  }`}
                >
                  {/* Animated Laser Scanning Line */}
                  {isScanning && !scanSuccess && (
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-electric-teal to-transparent shadow-[0_0_15px_#00f5ff] animate-scan z-20" />
                  )}

                  {/* Fingerprint Sensor Icon */}
                  <div className="relative z-10 mb-3">
                    <Fingerprint
                      className={`w-16 h-16 transition-all duration-300 ${
                        scanSuccess
                          ? 'text-emerald-neon scale-110'
                          : isScanning
                          ? 'text-electric-teal animate-pulse scale-105'
                          : 'text-electric-teal/70 group-hover:text-electric-teal group-hover:scale-105'
                      }`}
                    />
                  </div>

                  <div className="relative z-10 text-center">
                    <span className="text-xs font-bold text-white tracking-wide block">
                      {scanSuccess
                        ? 'Identity Verified • Enclave Unlocked'
                        : isScanning
                        ? 'Scanning Biometric Enclave...'
                        : 'Click to Scan Touch ID / Passkey'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                      {scanSuccess ? 'Routing to authorized workspace' : '1-Click Secure Instant Login'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBiometricScan}
                  disabled={isScanning}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-electric-teal to-emerald-neon hover:opacity-95 text-midnight-950 font-bold text-xs shadow-electric-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating Hardware Token...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-midnight-950" />
                      <span>Authenticate as {activeProfile.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Mode 2: Password / PIN Entry */}
            {mode === 'password' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Identity Account Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-midnight-900 border border-electric-teal/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-electric-teal focus:ring-2 focus:ring-electric-teal/30 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Enclave Passcode
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-[11px] text-electric-teal hover:underline font-mono"
                    >
                      Reset Token?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-midnight-900 border border-electric-teal/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-electric-teal focus:ring-2 focus:ring-electric-teal/30 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 rounded text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-electric-teal to-emerald-neon hover:opacity-95 text-midnight-950 font-bold text-xs shadow-electric-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Cryptographic Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In with Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Footer Links */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <Link to="/register" className="text-electric-teal hover:underline font-semibold">
                Create New Identity
              </Link>
              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-neon">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-neon animate-pulse" />
                <span>DPDP 2023 Validated</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Public Product Tour Link */}
      <footer className="relative z-10 pb-2 select-none">
        <Link
          to="/landing"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-midnight-900/80 hover:bg-midnight-850 border border-electric-teal/30 hover:border-electric-teal/60 text-slate-300 hover:text-white text-xs font-medium backdrop-blur-xl shadow-glass-sm transition-all hover:scale-105"
        >
          <Compass className="w-3.5 h-3.5 text-electric-teal" />
          <span>Explore Public Product Overview & Documentation</span>
          <ArrowRight className="w-3 h-3 text-slate-400" />
        </Link>
      </footer>
    </div>
  );
};
