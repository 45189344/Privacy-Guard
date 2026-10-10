import React from 'react';
import { RequestStatus, JobExecutionState } from '@/types';
import { clsx } from 'clsx';

interface StatusBadgeProps {
  status: RequestStatus | JobExecutionState | string;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  pulse = true,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'COMPLETED':
      case 'SUCCESS':
        return {
          label: 'Completed',
          bg: 'bg-emerald-500/10 dark:bg-emerald-400/10',
          text: 'text-emerald-700 dark:text-emerald-300',
          border: 'border-emerald-500/30',
          dot: 'bg-emerald-500',
        };
      case 'DELETION_IN_PROGRESS':
      case 'RUNNING':
        return {
          label: 'Processing',
          bg: 'bg-sky-500/10 dark:bg-sky-400/10',
          text: 'text-sky-700 dark:text-sky-300',
          border: 'border-sky-500/30',
          dot: 'bg-sky-500',
        };
      case 'APPROVED':
        return {
          label: 'Approved',
          bg: 'bg-teal-500/10 dark:bg-teal-400/10',
          text: 'text-teal-700 dark:text-teal-300',
          border: 'border-teal-500/30',
          dot: 'bg-teal-500',
        };
      case 'UNDER_REVIEW':
        return {
          label: 'Under Review',
          bg: 'bg-indigo-500/10 dark:bg-indigo-400/10',
          text: 'text-indigo-700 dark:text-indigo-300',
          border: 'border-indigo-500/30',
          dot: 'bg-indigo-500',
        };
      case 'VERIFIED':
        return {
          label: 'Verified',
          bg: 'bg-teal-500/10 dark:bg-teal-400/10',
          text: 'text-teal-700 dark:text-teal-300',
          border: 'border-teal-500/30',
          dot: 'bg-teal-500',
        };
      case 'VERIFICATION_PENDING':
      case 'PENDING':
      case 'PENDING_VERIFICATION':
        return {
          label: 'Pending Verification',
          bg: 'bg-amber-500/10 dark:bg-amber-400/10',
          text: 'text-amber-700 dark:text-amber-300',
          border: 'border-amber-500/30',
          dot: 'bg-amber-500',
        };
      case 'NEEDS_INFORMATION':
        return {
          label: 'Needs Info',
          bg: 'bg-amber-500/10 dark:bg-amber-400/10',
          text: 'text-amber-700 dark:text-amber-300',
          border: 'border-amber-500/30',
          dot: 'bg-amber-500',
        };
      case 'PARTIALLY_COMPLETED':
        return {
          label: 'Partially Completed',
          bg: 'bg-purple-500/10 dark:bg-purple-400/10',
          text: 'text-purple-700 dark:text-purple-300',
          border: 'border-purple-500/30',
          dot: 'bg-purple-500',
        };
      case 'RETRY_REQUIRED':
        return {
          label: 'Retry Queued',
          bg: 'bg-orange-500/10 dark:bg-orange-400/10',
          text: 'text-orange-700 dark:text-orange-300',
          border: 'border-orange-500/30',
          dot: 'bg-orange-500',
        };
      case 'REJECTED':
      case 'FAILED':
        return {
          label: status === 'REJECTED' ? 'Rejected' : 'Failed',
          bg: 'bg-rose-500/10 dark:bg-rose-400/10',
          text: 'text-rose-700 dark:text-rose-300',
          border: 'border-rose-500/30',
          dot: 'bg-rose-500',
        };
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          bg: 'bg-slate-500/10 dark:bg-slate-400/10',
          text: 'text-slate-700 dark:text-slate-400',
          border: 'border-slate-500/30',
          dot: 'bg-slate-400',
        };
      case 'SUBMITTED':
      default:
        return {
          label: status.replace(/_/g, ' '),
          bg: 'bg-slate-500/10 dark:bg-slate-400/10',
          text: 'text-slate-700 dark:text-slate-300',
          border: 'border-slate-500/20',
          dot: 'bg-slate-400',
        };
    }
  };

  const config = getStatusConfig();
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors',
        config.bg,
        config.text,
        config.border,
        sizeClasses
      )}
    >
      <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', config.dot, pulse && 'animate-pulse')} />
      <span className="capitalize">{config.label}</span>
    </span>
  );
};
