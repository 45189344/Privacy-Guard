import React, { useState, useEffect } from 'react';
import { StorageService } from '@/services/storage';
import { UserProfile } from '@/types';
import { GlassCard } from '@/components/ui/GlassCard';
import { Users, CheckCircle2, ShieldAlert } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    setUsers(StorageService.getUsers());
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Managed Data Principals
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Directory of registered data principals and internal DPO roles
        </p>
      </div>

      <GlassCard variant="elevated" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-midnight-950/50 text-slate-400 font-semibold">
                <th className="py-3 px-4">User ID</th>
                <th className="py-3 px-4">Full Legal Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4">Registered On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-600 dark:text-slate-300">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-midnight-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {u.id}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                    {u.fullName}
                  </td>
                  <td className="py-3.5 px-4 font-mono">{u.email}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        u.role === 'dpo_admin'
                          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                          : u.role === 'auditor'
                          ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300'
                          : 'bg-teal-500/15 text-teal-700 dark:text-teal-300'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{u.identityVerified ? 'VERIFIED' : 'PENDING'}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono">
                    {new Date(u.createdAt).toLocaleDateString()}
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
