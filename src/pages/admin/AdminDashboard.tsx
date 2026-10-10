import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { StorageService } from '@/services/storage';
import { DeletionRequest, RequestStatus } from '@/types';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BorderBeamSearch } from '@/components/ui/BorderBeamSearch';
import {
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Archive,
  ArrowRight,
  ExternalLink,
  Filter,
  RefreshCw,
  Search,
} from 'lucide-react';
import { OSWindowHeader } from '@/components/ui/OSWindowHeader';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<DeletionRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const refreshData = () => {
    setRequests(StorageService.getRequests());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const total = requests.length;
  const pendingVerification = requests.filter((r) => r.status === 'VERIFICATION_PENDING').length;
  const underReview = requests.filter((r) => r.status === 'UNDER_REVIEW').length;
  const inProgress = requests.filter(
    (r) => r.status === 'DELETION_IN_PROGRESS' || r.status === 'APPROVED'
  ).length;
  const completed = requests.filter(
    (r) => r.status === 'COMPLETED' || r.status === 'PARTIALLY_COMPLETED'
  ).length;
  const failedOrNeedsAttention = requests.filter(
    (r) => r.status === 'FAILED' || r.status === 'NEEDS_INFORMATION'
  ).length;

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchesSearch =
        searchQuery === '' ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === 'ALL' || r.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [requests, searchQuery, selectedStatus]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-[11px] font-semibold mb-1 border border-teal-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> DPO Operations Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Data Deletion Operations & Review
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Evaluate incoming data principal erasure petitions, document statutory holds, and audit deletion execution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refreshData}
            className="p-2.5 rounded-xl bg-white dark:bg-midnight-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-teal-500 shadow-sm transition-colors"
            title="Refresh Requests"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/admin/retention"
            className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/20 transition-colors flex items-center gap-1.5"
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Retention Holds</span>
          </Link>
          <Link
            to="/admin/deletion-jobs"
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-teal-glow transition-all flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Job Engine</span>
          </Link>
        </div>
      </div>

      {/* Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
        <GlassCard variant="default" className="p-4">
          <div className="text-[11px] font-semibold text-slate-400">Total Requests</div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {total}
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-4">
          <div className="text-[11px] font-semibold text-amber-500">Pending Proof</div>
          <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
            {pendingVerification}
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-4">
          <div className="text-[11px] font-semibold text-indigo-500">Under Review</div>
          <div className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">
            {underReview}
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-4">
          <div className="text-[11px] font-semibold text-sky-500">Processing</div>
          <div className="text-xl font-bold font-mono text-sky-600 dark:text-sky-400 mt-1">
            {inProgress}
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-4">
          <div className="text-[11px] font-semibold text-emerald-500">Completed</div>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {completed}
          </div>
        </GlassCard>

        <GlassCard variant="default" className="p-4">
          <div className="text-[11px] font-semibold text-rose-500">Attention Needed</div>
          <div className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">
            {failedOrNeedsAttention}
          </div>
        </GlassCard>
      </div>

      {/* Search & Filter Toolbar */}
      <GlassCard variant="default" className="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1">
            <BorderBeamSearch
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by request ID, user name, email, or category..."
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-midnight-950/80 border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            >
              <option value="ALL">All Operational Statuses</option>
              <option value="UNDER_REVIEW">Under Review (Requires Action)</option>
              <option value="VERIFICATION_PENDING">Pending Verification</option>
              <option value="APPROVED">Approved</option>
              <option value="DELETION_IN_PROGRESS">Deletion In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="PARTIALLY_COMPLETED">Partially Completed</option>
              <option value="NEEDS_INFORMATION">Needs Information</option>
              <option value="FAILED">Failed</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Requests Management Table */}
      <div className="rounded-2xl border border-electric-teal/20 bg-midnight-950/70 backdrop-blur-2xl shadow-glass-md overflow-hidden">
        <OSWindowHeader title="DPO Operations Review Queue" subtitle="DPDP Section 8 Deletion Pipeline" badge="PID: 4912" />
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">
            Operational Request Queue ({filteredRequests.length})
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">
            Four-eyes principle active: All state changes are immutably logged
          </span>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No matching requests in this operational queue.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-midnight-950/50 text-slate-400 font-semibold">
                  <th className="py-3 px-4">Request Ref</th>
                  <th className="py-3 px-4">Data Principal</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Submission Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Reviewer</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-600 dark:text-slate-300">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-midnight-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-600 dark:text-teal-400">
                      <Link to={`/admin/requests/${req.id}`} className="hover:underline">
                        {req.id}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {req.userName}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                        {req.userEmail}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium">
                      {req.category.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      {new Date(req.createdAt).toLocaleDateString([], {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={req.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      {req.reviewerName || 'Unassigned'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/admin/requests/${req.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-[11px] shadow-teal-glow transition-all"
                      >
                        <span>Review</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
