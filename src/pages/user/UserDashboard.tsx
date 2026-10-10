import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { StorageService } from '@/services/storage';
import { DeletionRequest } from '@/types';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  Shield,
  FileCheck2,
  ExternalLink,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { OSWindowHeader } from '@/components/ui/OSWindowHeader';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<DeletionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    // Strict Tenancy Boundary: Only load requests owned by the authenticated user
    const all = StorageService.getRequests();
    const myRequests = all.filter((r) => r.userId === user.id);
    setRequests(myRequests);
    setLoading(false);
  }, [user]);

  const total = requests.length;
  const pending = requests.filter((r) => r.status === 'VERIFICATION_PENDING').length;
  const inProgress = requests.filter(
    (r) => r.status === 'DELETION_IN_PROGRESS' || r.status === 'UNDER_REVIEW' || r.status === 'APPROVED'
  ).length;
  const completed = requests.filter(
    (r) => r.status === 'COMPLETED' || r.status === 'PARTIALLY_COMPLETED'
  ).length;

  // Chart data
  const chartData = [
    { name: 'Completed', value: completed, color: '#10b981' },
    { name: 'In Progress', value: inProgress, color: '#3b82f6' },
    { name: 'Pending Verification', value: pending, color: '#f59e0b' },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-[11px] font-semibold mb-1 border border-teal-500/20">
            <Shield className="w-3 h-3" /> Data Principal Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {user?.fullName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor, submit, and verify your personal data erasure requests under DPDP principles.
          </p>
        </div>

        <Link
          to="/app/requests/new"
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-teal-glow transition-all flex items-center gap-2 shrink-0 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Deletion Request</span>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard variant="default" className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Requests</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-midnight-800 text-slate-600 dark:text-slate-300">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono">
            {total}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Your registered requests</div>
        </GlassCard>

        <GlassCard variant="default" className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Pending Verification</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono">
            {pending}
          </div>
          <div className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-1">
            Requires identity proofing
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">In Active Processing</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono">
            {inProgress}
          </div>
          <div className="text-[11px] text-sky-600/80 dark:text-sky-400/80 mt-1">
            Under DPO review or deletion
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Completed & Verified</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono">
            {completed}
          </div>
          <div className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-1">
            Signed erasure proofs issued
          </div>
        </GlassCard>
      </div>

      {/* Main Content Split: Recent Requests & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Requests Table */}
        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-electric-teal/20 bg-midnight-950/70 backdrop-blur-2xl shadow-glass-md overflow-hidden">
            <OSWindowHeader title="Recent Deletion Requests" subtitle="Tenancy Enclave" badge="LIVE ENCLAVE" />
            <div className="p-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h2 className="text-sm font-bold text-white">
                  Active Requests Ledger
                </h2>
                <Link
                  to="/app/requests"
                  className="text-xs font-semibold text-electric-teal hover:underline flex items-center gap-1 font-mono"
                >
                  <span>View All ({total})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading requests...</div>
            ) : requests.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <FileCheck2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  No deletion requests submitted yet
                </div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  You have not submitted any personal data erasure requests. Start a request to take control of your footprint.
                </p>
                <Link
                  to="/app/requests/new"
                  className="inline-block mt-2 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold shadow-teal-glow"
                >
                  Create First Request
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-white/5 mt-2">
                {requests.slice(0, 5).map((req) => (
                  <div key={req.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/app/requests/${req.id}`}
                          className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
                        >
                          {req.id}
                        </Link>
                        <span className="text-[11px] text-slate-400">•</span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {req.category.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-md">
                        {req.scopeDetails}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusBadge status={req.status} size="sm" />
                      <Link
                        to={`/app/requests/${req.id}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-midnight-800"
                        title="Track Request"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>

        {/* Status Distribution Visual */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-electric-teal/20 bg-midnight-950/70 backdrop-blur-2xl shadow-glass-md overflow-hidden">
            <OSWindowHeader title="Status Breakdown" subtitle="Telemetry" badge="STATE" />
            <div className="p-6">
              <p className="text-xs text-slate-400 mb-4 font-sans">
                Real-time state distribution for your account
              </p>

              {chartData.length > 0 ? (
                <div className="h-56 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(5, 12, 30, 0.95)',
                          border: '1px solid rgba(0, 245, 255, 0.3)',
                          borderRadius: '12px',
                          fontSize: '11px',
                          color: '#fff',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-xs text-slate-400 font-mono">
                  No active metrics yet
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs">
                {chartData.map((d, i) => (
                  <div key={i} className="flex items-center justify-between font-mono">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-slate-300">{d.name}</span>
                    </div>
                    <span className="font-bold text-white">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
