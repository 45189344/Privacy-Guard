import React, { useState, useEffect } from 'react';
import { StorageService } from '@/services/storage';
import { generateCsv, downloadCsv } from '@/services/exportService';
import { SystemMetrics } from '@/types';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Download,
  ShieldCheck,
  Archive,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);

  useEffect(() => {
    setMetrics(StorageService.getMetrics());
  }, []);

  if (!metrics) {
    return <div className="py-20 text-center text-xs text-slate-400">Loading metrics...</div>;
  }

  const handleExportAnalyticsCsv = () => {
    const headers = ['Month', 'Requests Received', 'Completed Deletions', 'Retention Exceptions'];
    const rows = metrics.monthlyTrend.map((m) => [m.month, m.received, m.completed, m.exceptions]);
    const csv = generateCsv(headers, rows);
    downloadCsv(`privacyguard_analytics_${Date.now()}.csv`, csv);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Privacy Lifecycle Analytics & SLAs
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Operational throughput, statutory compliance turnaround, and deletion success verification
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportAnalyticsCsv}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-teal-glow transition-all flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Analytics Report</span>
        </button>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard variant="default" className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Avg Processing Duration</span>
            <Clock className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-2">
            {metrics.averageProcessingDays} Days
          </div>
          <div className="text-[11px] text-teal-600 dark:text-teal-400 mt-1">
            DPDP 30-Day SLA Standard: 100% compliant
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Identity Proof Rate</span>
            <ShieldCheck className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-2">
            {metrics.verificationSuccessRate}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Passed multi-factor challenge</div>
        </GlassCard>

        <GlassCard variant="default" className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Deletion Verification</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-2">
            {metrics.deletionSuccessRate}%
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            Signed erasure digests issued
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Retention Holds</span>
            <Archive className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-2">
            {metrics.retentionExceptionsCount}
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
            Lawful Section 8(7) reservations
          </div>
        </GlassCard>
      </div>

      {/* Recharts Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend Area Chart */}
        <div className="lg:col-span-8">
          <GlassCard variant="elevated" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Request Intake & Resolution Volume
              </h2>
              <span className="text-xs font-mono text-slate-400">Trailing 5 Months</span>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.monthlyTrend}>
                  <defs>
                    <linearGradient id="receivedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(8, 16, 35, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: '#fff',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="received"
                    stroke="#14b8a6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#receivedGrad)"
                    name="Requests Received"
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#completedGrad)"
                    name="Completed & Verified"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Status Breakdown Donut */}
        <div className="lg:col-span-4">
          <GlassCard variant="elevated" className="p-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Lifecycle Breakdown
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Current operational distribution
            </p>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {metrics.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(8, 16, 35, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 space-y-2 text-xs">
              {metrics.statusDistribution.map((d, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-slate-600 dark:text-slate-400">{d.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{d.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
