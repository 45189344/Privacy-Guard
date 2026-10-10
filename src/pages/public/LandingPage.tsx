import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCenterpiece3D } from '@/components/ui/ShieldCenterpiece3D';
import { CoverFlowCarousel } from '@/components/ui/CoverFlowCarousel';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Fingerprint,
  RefreshCw,
  Scale,
  Database,
  FileCheck2,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background ambient lighting gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-teal-500/10 via-sky-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 dark:bg-teal-400/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span>Aligned with India's DPDP Act 2023 Principles</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Your Personal Data.{' '}
              <span className="bg-gradient-to-r from-teal-500 via-teal-400 to-sky-400 bg-clip-text text-transparent">
                Your Decision.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Take control of your digital footprint. Submit, track, and manage personal data deletion requests through a transparent, privacy-focused workflow with verifiable cryptographic proof.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/app/requests/new"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm shadow-teal-glow transition-all flex items-center justify-center gap-2 group active:scale-95"
              >
                <span>Request Data Deletion</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/how-it-works"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white/80 dark:bg-midnight-900/80 hover:bg-white dark:hover:bg-midnight-850 text-slate-700 dark:text-slate-200 font-semibold text-sm border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Explore How It Works</span>
              </Link>
            </div>

            {/* Trust Points */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/60 dark:border-white/10 text-left">
              <div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">100%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Verifiable Erasure</div>
              </div>
              <div>
                <div className="text-xl font-bold text-teal-600 dark:text-teal-400">Zero</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Data Guessing IDs</div>
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">Append-Only</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Audit Provenance</div>
              </div>
            </div>
          </div>

          {/* 3D Centerpiece */}
          <div className="lg:col-span-5 flex justify-center">
            <ShieldCenterpiece3D />
          </div>
        </div>
      </section>

      {/* 3D COVERFLOW FEATURE SHOWCASE */}
      <section className="py-20 bg-slate-50/50 dark:bg-midnight-950/50 border-y border-slate-200/60 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold mb-3">
            <span>3D Interactive Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Six Stages of Responsible Data Erasure
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mt-3">
            Swipe or use arrow keys to inspect each milestone of the PrivacyGuard verifiable erasure pipeline.
          </p>
        </div>

        <CoverFlowCarousel />
      </section>

      {/* HOW IT WORKS LIFELINE TIMELINE */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Transparent Request Lifecycle
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-3">
            Never wonder what happened to your request. Every stage is recorded in an explicit state machine with timestamps and actor verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Granular Selection',
              desc: 'Choose complete erasure or target categories such as telemetry, past chats, or payment tokens.',
              icon: Fingerprint,
            },
            {
              step: '02',
              title: 'Identity Challenge',
              desc: 'Authenticate ownership via email OTP or multi-factor challenge to prevent unauthorized requests.',
              icon: Lock,
            },
            {
              step: '03',
              title: 'Statutory Review',
              desc: 'Data Protection Officer reviews statutory obligations and documents any lawful retention exceptions.',
              icon: Scale,
            },
            {
              step: '04',
              title: 'Cryptographic Purge',
              desc: 'Target data stores are purged with idempotent jobs, returning a signed proof-of-erasure receipt.',
              icon: FileCheck2,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <GlassCard key={idx} variant="default" interactive className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black font-mono text-teal-600 dark:text-teal-400">
                    {item.step}
                  </span>
                  <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* DASHBOARD PREVIEW DEMO */}
      <section className="py-20 bg-slate-100/60 dark:bg-midnight-900/40 border-t border-slate-200/80 dark:border-white/5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                Live Interface Preview
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Unified Portal Experience
              </h2>
            </div>
            <Link
              to="/app"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
            >
              <span>Launch Live Interactive Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <GlassCard variant="elevated" className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-500 flex items-center justify-center font-bold">
                  PG
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Request Reference: PG-2026-8942-X7
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Category: ACCOUNT_AND_ALL_DATA • Verified: 2026-03-01
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>COMPLETED & VERIFIED</span>
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-midnight-950/60 border border-slate-200/60 dark:border-white/5">
                <div className="text-slate-400">Target Stores</div>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-1">4 Stores</div>
                <div className="text-[11px] text-emerald-500 mt-1">100% Cleared</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-midnight-950/60 border border-slate-200/60 dark:border-white/5">
                <div className="text-slate-400">Statutory Holds</div>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-1">0 Exceptions</div>
                <div className="text-[11px] text-slate-500 mt-1">Full erasure permitted</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-midnight-950/60 border border-slate-200/60 dark:border-white/5">
                <div className="text-slate-400">Turnaround Time</div>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-1">2.2 Days</div>
                <div className="text-[11px] text-teal-500 mt-1">Within DPDP 30d SLA</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-midnight-950/60 border border-slate-200/60 dark:border-white/5">
                <div className="text-slate-400">Cryptographic Receipt</div>
                <div className="text-xs font-mono text-teal-600 dark:text-teal-400 truncate mt-2 font-bold">
                  sha256_8f3d1b99a6c743e0
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Auditor Signed</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <GlassCard variant="teal-glow" className="p-10 sm:p-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Take Control of Your Data
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto mt-4 leading-relaxed">
            Experience end-to-end transparent personal data deletion request management. Built on DPDP principles with verifiable cryptographic receipts.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/app/requests/new"
              className="px-8 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm shadow-teal-glow transition-all"
            >
              Start Deletion Request
            </Link>
            <Link
              to="/security"
              className="px-8 py-3.5 rounded-2xl bg-white/80 dark:bg-midnight-900/80 hover:bg-white dark:hover:bg-midnight-850 text-slate-700 dark:text-slate-200 font-semibold text-sm border border-slate-200 dark:border-white/10 transition-all"
            >
              View Security Architecture
            </Link>
          </div>
        </GlassCard>
      </section>
    </div>
  );
};
