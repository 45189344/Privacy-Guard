import React, { useState, useEffect } from 'react';
import { Shield, Lock, Wifi, BatteryCharging, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const OSStatusBar: React.FC = () => {
  const { user, logout, isDPOAdmin } = useAuth();
  const navigate = useNavigate();
  const [timeString, setTimeString] = useState<string>('');
  const [dateString, setDateString] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setDateString(
        now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLockEnclave = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="relative z-50 w-full bg-midnight-950/90 backdrop-blur-xl border-b border-electric-teal/20 text-slate-300 text-[11px] font-mono select-none px-3 py-1 flex items-center justify-between shadow-sm">
      {/* Left Menu Items */}
      <div className="flex items-center gap-3">
        {/* Apple/Shield OS Menu Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-electric-teal/10 hover:text-electric-teal transition-colors focus:outline-none"
            aria-label="PrivacyGuard OS menu"
          >
            <Shield className="w-3.5 h-3.5 text-electric-teal fill-electric-teal/20" />
            <span className="font-bold text-white tracking-tight font-sans">PrivacyGuard OS</span>
          </button>

          {menuOpen && (
            <div
              className="absolute left-0 mt-1 w-60 rounded-xl bg-midnight-900/95 backdrop-blur-2xl border border-electric-teal/30 shadow-os-window py-2 text-xs font-sans text-slate-200 z-50"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <div className="px-3 py-1.5 border-b border-white/5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-electric-teal" />
                  PrivacyGuard Enclave OS
                </div>
                <div className="text-[10px] text-slate-400 font-mono">Build 2026.10-DPDP-v4.2</div>
              </div>

              <div className="py-1">
                <div className="px-3 py-1 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Hardware Security:</span>
                  <span className="text-emerald-neon font-mono font-semibold">Active (HSM)</span>
                </div>
                <div className="px-3 py-1 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Cryptographic Mode:</span>
                  <span className="text-electric-teal font-mono">AES-256-GCM</span>
                </div>
                <div className="px-3 py-1 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Active Identity:</span>
                  <span className="text-white truncate max-w-[110px]">{user?.fullName || 'Guest'}</span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-1 mt-1">
                <button
                  type="button"
                  onClick={handleLockEnclave}
                  className="w-full text-left px-3 py-1.5 hover:bg-rose-500/15 hover:text-rose-400 flex items-center justify-between text-xs text-rose-400 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5" />
                    Lock Enclave Session
                  </span>
                  <span className="font-mono text-[10px] opacity-70">⌥⌘L</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* OS Submenu items */}
        <div className="hidden sm:flex items-center gap-3 text-slate-400">
          <span className="hover:text-slate-200 cursor-default">File</span>
          <span className="hover:text-slate-200 cursor-default">Enclave</span>
          <span className="hover:text-slate-200 cursor-default">Verification</span>
          <span className="hover:text-slate-200 cursor-default">Audit</span>
        </div>
      </div>

      {/* Right System Indicators */}
      <div className="flex items-center gap-3">
        {/* Zero-Knowledge Proof Status */}
        <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-neon/10 border border-emerald-neon/20 text-emerald-neon text-[10px]">
          <CheckCircle2 className="w-3 h-3" />
          <span>ZK-PROVED</span>
        </div>

        {/* Network & Latency */}
        <div className="hidden sm:flex items-center gap-1.5 text-slate-400 text-[10px]">
          <Wifi className="w-3 h-3 text-electric-teal" />
          <span>12ms</span>
        </div>

        {/* Power Status */}
        <div className="hidden sm:flex items-center gap-1 text-slate-400 text-[10px]">
          <BatteryCharging className="w-3 h-3 text-emerald-neon" />
          <span>100%</span>
        </div>

        {/* Live Digital Clock */}
        <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-midnight-900 border border-electric-teal/20 text-electric-teal font-semibold">
          <span className="hidden lg:inline text-slate-400">{dateString}</span>
          <span>{timeString}</span>
        </div>

        {/* Lock Screen Shortcut Button */}
        <button
          type="button"
          onClick={handleLockEnclave}
          title="Lock Enclave Session & Return to Lock Screen"
          className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-transparent hover:border-rose-500/30 transition-colors"
          aria-label="Lock Enclave"
        >
          <Lock className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
