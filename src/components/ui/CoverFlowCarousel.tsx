import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Shield, KeyRound, Clock, CheckCircle2, FileText, Lock } from 'lucide-react';
import { GlassCard } from './GlassCard';

export interface CarouselCardItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  specs: string[];
}

const DEFAULT_CAROUSEL_ITEMS: CarouselCardItem[] = [
  {
    id: 'feature_1',
    badge: 'Stage 1 — Intake',
    title: 'Cryptographic Submission',
    description: 'Submit granular or full erasure requests with end-to-end payload integrity and non-predictable tracking identifiers.',
    icon: <Lock className="w-8 h-8 text-teal-400" />,
    specs: ['DPDP Right to Erasure', 'Non-guessable PG references', 'Automated deduplication'],
  },
  {
    id: 'feature_2',
    badge: 'Stage 2 — Verification',
    title: 'Multi-Factor Identity Proof',
    description: 'Ensure only verified data principals can trigger deletion workflows, defeating impersonation and social engineering.',
    icon: <KeyRound className="w-8 h-8 text-sky-400" />,
    specs: ['Email OTP Challenge', 'FIDO2 / WebAuthn ready', 'Possession vs Identity check'],
  },
  {
    id: 'feature_3',
    badge: 'Stage 3 — Review',
    title: 'DPO Legal Evaluation',
    description: 'Authorized Data Protection Officers evaluate statutory compliance, active contract dependencies, and legal holds.',
    icon: <Shield className="w-8 h-8 text-teal-300" />,
    specs: ['Four-eyes principle', 'Role-based authorization', 'Explicit rejection rationale'],
  },
  {
    id: 'feature_4',
    badge: 'Stage 4 — Retention',
    title: 'Documented Retention Holds',
    description: 'Legitimate statutory obligations (tax, financial AML) are isolated into auditable, scheduled-review retention exceptions.',
    icon: <FileText className="w-8 h-8 text-amber-400" />,
    specs: ['Section 8(7) DPDP compliance', 'Specific legal basis tags', 'Automated review triggers'],
  },
  {
    id: 'feature_5',
    badge: 'Stage 5 — Execution',
    title: 'Distributed Deletion Engine',
    description: 'Idempotent deletion workers dispatch cryptographic purges across relational DBs, object vaults, caches, and search clusters.',
    icon: <Clock className="w-8 h-8 text-indigo-400" />,
    specs: ['Multi-store adapters', 'Exponential backoff retries', 'Tombstone & crypto erasure'],
  },
  {
    id: 'feature_6',
    badge: 'Stage 6 — Audit',
    title: 'Verifiable Proof of Erasure',
    description: 'Generate tamper-evident cryptographic deletion certificates complete with store hashes and append-only audit trails.',
    icon: <CheckCircle2 className="w-8 h-8 text-emerald-400" />,
    specs: ['SHA-256 store hashes', 'Append-only audit logs', 'Formula-safe CSV exports'],
  },
];

export const CoverFlowCarousel: React.FC<{ items?: CarouselCardItem[] }> = ({
  items = DEFAULT_CAROUSEL_ITEMS,
}) => {
  const [activeIndex, setActiveIndex] = useState(2); // Start around middle
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  const prev = () => {
    setActiveIndex((curr) => (curr > 0 ? curr - 1 : items.length - 1));
  };

  const next = () => {
    setActiveIndex((curr) => (curr < items.length - 1 ? curr + 1 : 0));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.closest('#coverflow-container')) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prev();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          next();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (diff > 50) next();
    if (diff < -50) prev();
    touchStartXRef.current = null;
  };

  return (
    <div
      id="coverflow-container"
      tabIndex={0}
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-label="PrivacyGuard 3D Coverflow Features Carousel"
      className="relative w-full py-12 px-4 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-3xl"
    >
      {/* 3D Stage Container */}
      <div
        className="relative h-[420px] max-w-5xl mx-auto flex items-center justify-center"
        style={{ perspective: '1200px' }}
      >
        {items.map((item, index) => {
          const offset = index - activeIndex;
          const isActive = index === activeIndex;
          const isVisible = Math.abs(offset) <= 2;

          if (!isVisible) return null;

          // Calculate 3D transforms based on offset
          let transform = '';
          let zIndex = 10 - Math.abs(offset);
          let opacity = 1;

          if (isActive) {
            transform = 'translateX(0%) translateZ(80px) rotateY(0deg) scale(1.05)';
          } else if (offset < 0) {
            transform = `translateX(${offset * 58}%) translateZ(-${Math.abs(offset) * 120}px) rotateY(${Math.min(35, Math.abs(offset) * 25)}deg) scale(${1 - Math.abs(offset) * 0.12})`;
            opacity = Math.max(0.35, 1 - Math.abs(offset) * 0.35);
          } else {
            transform = `translateX(${offset * 58}%) translateZ(-${Math.abs(offset) * 120}px) rotateY(-${Math.min(35, Math.abs(offset) * 25)}deg) scale(${1 - Math.abs(offset) * 0.12})`;
            opacity = Math.max(0.35, 1 - Math.abs(offset) * 0.35);
          }

          return (
            <div
              key={item.id}
              onClick={() => setActiveIndex(index)}
              style={{
                transform,
                zIndex,
                opacity,
                transition: 'all 500ms cubic-bezier(0.25, 1, 0.5, 1)',
              }}
              className="absolute w-[310px] sm:w-[360px] cursor-pointer"
            >
              <GlassCard
                variant={isActive ? 'teal-glow' : 'default'}
                className={`p-6 sm:p-7 border h-full transition-all duration-300 ${
                  isActive ? 'ring-1 ring-teal-400/40' : 'hover:border-slate-400/40'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/10 dark:bg-teal-400/10 px-2.5 py-1 rounded-full border border-teal-500/20">
                    {item.badge}
                  </span>
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-midnight-800/80 border border-slate-200 dark:border-white/10">
                    {item.icon}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-5 leading-relaxed line-clamp-3">
                  {item.description}
                </p>

                <div className="pt-4 border-t border-slate-200/60 dark:border-white/10 space-y-2">
                  {item.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-2 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          );
        })}
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous card"
          className="p-2.5 rounded-full bg-white/80 dark:bg-midnight-900/80 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-teal-500 hover:border-teal-500/50 shadow-sm backdrop-blur-md transition-all active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Indicator dots */}
        <div className="flex items-center gap-2">
          {items.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setActiveIndex(dotIdx)}
              aria-label={`Jump to slide ${dotIdx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                dotIdx === activeIndex
                  ? 'w-7 bg-teal-500'
                  : 'w-2 bg-slate-300 dark:bg-midnight-700 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Next card"
          className="p-2.5 rounded-full bg-white/80 dark:bg-midnight-900/80 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-teal-500 hover:border-teal-500/50 shadow-sm backdrop-blur-md transition-all active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
