import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  User,
  Shield,
  Clock,
  Archive,
  History,
  BarChart3,
  Users,
  Settings,
  ShieldAlert,
} from 'lucide-react';

interface SidebarProps {
  type: 'user' | 'admin';
}

export const Sidebar: React.FC<SidebarProps> = ({ type }) => {
  const { user, isDPOAdmin } = useAuth();

  const userLinks = [
    { to: '/app', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/app/requests/new', label: 'New Deletion Request', icon: PlusCircle },
    { to: '/app/requests', label: 'My Requests', icon: FileText },
    { to: '/app/profile', label: 'Identity Profile', icon: User },
    { to: '/app/security', label: 'Security & Auth', icon: Shield },
    { to: '/app/privacy', label: 'Privacy Rights', icon: ShieldAlert },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Operations Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/requests', label: 'Review Queue', icon: FileText },
    { to: '/admin/deletion-jobs', label: 'Deletion Job Engine', icon: Clock },
    { to: '/admin/retention', label: 'Retention Holds', icon: Archive },
    { to: '/admin/audit', label: 'Audit Trail', icon: History },
    { to: '/admin/analytics', label: 'Analytics & SLA', icon: BarChart3 },
    { to: '/admin/users', label: 'Data Principals', icon: Users },
    { to: '/admin/settings', label: 'System Configuration', icon: Settings },
  ];

  const links = type === 'admin' ? adminLinks : userLinks;

  return (
    <aside className="w-64 shrink-0 hidden md:block">
      <div className="sticky top-20 p-4 rounded-2xl bg-white/70 dark:bg-midnight-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-glass-sm space-y-6">
        {/* User Card */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-midnight-950/60 border border-slate-200/50 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-electric-teal to-emerald-neon text-midnight-950 font-extrabold flex items-center justify-center text-sm shadow-electric-glow">
              {user?.fullName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">
                {user?.fullName}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {user?.email}
              </div>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Role:</span>
            <span className="font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-electric-teal/15 text-electric-teal border border-electric-teal/30">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            {type === 'admin' ? 'DPO Workspace' : 'Personal Portal'}
          </div>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-electric-teal to-emerald-neon text-midnight-950 shadow-electric-glow font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-white/5 font-semibold'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Switch portal link if admin */}
        {isDPOAdmin && (
          <div className="pt-3 border-t border-slate-200/50 dark:border-white/5">
            <NavLink
              to={type === 'admin' ? '/app' : '/admin'}
              className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-midnight-800 text-slate-700 dark:text-slate-200 hover:bg-teal-500/10 hover:text-teal-600 transition-colors"
            >
              {type === 'admin' ? 'Switch to User View' : 'Switch to DPO Admin View'}
            </NavLink>
          </div>
        )}
      </div>
    </aside>
  );
};
