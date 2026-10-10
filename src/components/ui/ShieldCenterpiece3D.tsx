import React, { useState, useEffect, useRef } from 'react';
import { Shield, Lock, CheckCircle2, Database, Key } from 'lucide-react';

export const ShieldCenterpiece3D: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const rotateX = prefersReducedMotion ? 0 : -mousePos.y * 14;
  const rotateY = prefersReducedMotion ? 0 : mousePos.x * 18;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="PrivacyGuard 3D Interactive Shield Visualization"
      className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center p-6 select-none"
      style={{ perspective: '1000px' }}
    >
      {/* Ambient Radial Glow */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-teal-500/20 via-sky-500/15 to-transparent blur-3xl pointer-events-none animate-pulse-gentle" />

      {/* 3D Master Pivot Layer */}
      <div
        className="relative w-72 h-80 sm:w-80 sm:h-96 flex items-center justify-center transition-transform duration-200 ease-out preserve-3d"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        {/* Outer Orbit Ring 1 */}
        <div
          className="absolute inset-0 rounded-full border border-teal-500/20 border-dashed animate-[spin_24s_linear_infinite] pointer-events-none"
          style={{ transform: 'translateZ(-40px) scale(1.15)' }}
        />

        {/* Outer Orbit Ring 2 */}
        <div
          className="absolute inset-4 rounded-full border border-sky-400/25 animate-[spin_18s_linear_infinite_reverse] pointer-events-none"
          style={{ transform: 'translateZ(-20px) scale(0.95)' }}
        />

        {/* Floating Data Nodes in 3D Space */}
        <div
          className="absolute -top-3 left-4 p-2.5 rounded-xl bg-white/80 dark:bg-midnight-900/80 backdrop-blur-md border border-teal-500/30 shadow-glass-sm transition-transform duration-300"
          style={{ transform: `translateZ(${40 + mousePos.x * 15}px)` }}
        >
          <Database className="w-4 h-4 text-teal-400" />
        </div>

        <div
          className="absolute -bottom-2 right-4 p-2.5 rounded-xl bg-white/80 dark:bg-midnight-900/80 backdrop-blur-md border border-sky-400/30 shadow-glass-sm transition-transform duration-300"
          style={{ transform: `translateZ(${50 - mousePos.y * 15}px)` }}
        >
          <Key className="w-4 h-4 text-sky-400" />
        </div>

        <div
          className="absolute top-1/2 -right-4 -translate-y-1/2 p-2.5 rounded-xl bg-white/80 dark:bg-midnight-900/80 backdrop-blur-md border border-emerald-500/30 shadow-glass-sm transition-transform duration-300"
          style={{ transform: `translateZ(${35 + mousePos.y * 12}px)` }}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </div>

        {/* Main Dimensional Glass Shield Core */}
        <div
          className="relative w-52 h-64 sm:w-60 sm:h-72 rounded-[42px] bg-gradient-to-br from-white/70 via-white/40 to-white/10 dark:from-midnight-800/80 dark:via-midnight-900/70 dark:to-midnight-950/80 backdrop-blur-2xl border border-white/40 dark:border-white/20 shadow-glass-lg flex flex-col items-center justify-center p-6 text-center overflow-hidden"
          style={{
            transform: 'translateZ(20px)',
            boxShadow: '0 25px 60px -15px rgba(20, 184, 166, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
          }}
        >
          {/* Subtle Top-Light Glass Reflection Beam */}
          <div className="absolute -inset-x-20 top-0 h-32 bg-gradient-to-b from-white/30 dark:from-teal-400/15 via-transparent to-transparent -rotate-12 pointer-events-none" />

          {/* Shield Emblems */}
          <div className="relative mb-5 p-4 rounded-2xl bg-teal-500/10 dark:bg-teal-400/10 border border-teal-500/30 shadow-inner">
            <Shield className="w-12 h-12 text-teal-600 dark:text-teal-400" />
            <Lock className="w-5 h-5 text-white absolute bottom-3.5 right-3.5 fill-teal-500" />
          </div>

          <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            PrivacyGuard Core
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[170px] leading-relaxed">
            Verifiable DPDP Data Lifecycle Shield
          </p>

          {/* Micro Status Chip */}
          <div className="mt-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Cryptographically Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
