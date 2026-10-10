import React, { useState, useEffect, useMemo } from 'react';
import { StorageService } from '@/services/storage';
import { generateCsv, downloadCsv } from '@/services/exportService';
import { AuditEvent, AuditEventType } from '@/types';
import { GlassCard } from '@/components/ui/GlassCard';
import { BorderBeamSearch } from '@/components/ui/BorderBeamSearch';
import {
  History,
  Download,
  Filter,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const refreshEvents = () => {
    setEvents(StorageService.getAuditEvents());
  };

  useEffect(() => {
    refreshEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchesSearch =
        searchQuery === '' ||
        ev.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.actorEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ev.requestId && ev.requestId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        ev.correlationId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === 'ALL' || ev.eventType === selectedType;

      return matchesSearch && matchesType;
    });
  }, [events, searchQuery, selectedType]);

  const handleExportCsv = () => {
    const headers = [
      'Event ID',
      'Event Type',
      'Actor ID',
      'Actor Email',
      'Actor Role',
      'Request ID',
      'Timestamp',
      'Outcome',
      'Correlation ID',
      'Masked IP',
    ];

    const rows = filteredEvents.map((e) => [
      e.id,
      e.eventType,
      e.actorId,
      e.actorEmail,
      e.actorRole,
      e.requestId || 'N/A',
      e.timestamp,
      e.outcome,
      e.correlationId,
      e.ipAddressMasked,
    ]);

    const csvData = generateCsv(headers, rows);
    downloadCsv(`privacyguard_audit_trail_${Date.now()}.csv`, csvData);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Append-Only Audit Trail
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Immutable chronological record of submissions, identity challenges, DPO reviews, and deletion jobs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refreshEvents}
            className="p-2 rounded-xl bg-white dark:bg-midnight-900 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-teal-500 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-teal-glow transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Sanitized CSV</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <GlassCard variant="default" className="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1">
            <BorderBeamSearch
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by event ID, actor, request reference, or correlation ID..."
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-midnight-950/80 border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            >
              <option value="ALL">All Event Types</option>
              <option value="REQUEST_SUBMITTED">REQUEST_SUBMITTED</option>
              <option value="IDENTITY_VERIFIED">IDENTITY_VERIFIED</option>
              <option value="REQUEST_REVIEWED">REQUEST_REVIEWED</option>
              <option value="STATUS_CHANGED">STATUS_CHANGED</option>
              <option value="DELETION_JOB_SCHEDULED">DELETION_JOB_SCHEDULED</option>
              <option value="DELETION_JOB_EXECUTED">DELETION_JOB_EXECUTED</option>
              <option value="RETENTION_EXCEPTION_CREATED">RETENTION_EXCEPTION_CREATED</option>
              <option value="VERIFICATION_CONFIRMED">VERIFICATION_CONFIRMED</option>
              <option value="USER_LOGIN">USER_LOGIN</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Audit Log Table */}
      <GlassCard variant="elevated" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-midnight-950/50 text-slate-400 font-semibold">
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Target Request</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Outcome</th>
                <th className="py-3 px-4">Correlation ID</th>
                <th className="py-3 px-4">Masked IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-600 dark:text-slate-300">
              {filteredEvents.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50/50 dark:hover:bg-midnight-800/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {ev.id}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-teal-600 dark:text-teal-400 text-[11px]">
                    {ev.eventType}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{ev.actorEmail}</div>
                    <div className="text-[10px] uppercase font-mono text-slate-400">{ev.actorRole}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-teal-600 dark:text-teal-400">
                    {ev.requestId || '—'}
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    {new Date(ev.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 font-bold text-[11px] ${
                        ev.outcome === 'SUCCESS'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-500'
                      }`}
                    >
                      {ev.outcome === 'SUCCESS' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      <span>{ev.outcome}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[10px] text-slate-400 truncate max-w-[120px]">
                    {ev.correlationId}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                    {ev.ipAddressMasked}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
