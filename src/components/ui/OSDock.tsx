import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Shield,
  History,
  User,
  Settings,
  Lock,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';

export const OSDock: React.FC = () => {
  const { user, isDPOAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMinimized, setIsMinimized] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const handleLock = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const dockItems = isDPOAdmin
    ? [
        { to: '/admin', label: 'DPO Command Center', icon: LayoutDashboard },
        { to: '/admin/requests', label: 'Review Queue', icon: FileText },
        { to: '/admin/retention', label: 'Retention Holds', icon: Shield },
        { to: '/admin/audit', label: 'Audit Trail', icon: History },
        { to: '/admin/settings', label: 'System Configuration', icon: Settings },
      ]
    : [
        { to: '/app', label: 'Personal Dashboard', icon: LayoutDashboard },
        { to: '/app/requests/new', label: 'Submit Deletion', icon: PlusCircle },
        { to: '/app/requests', label: 'Track Requests', icon: FileText },
        { to: '/app/security', label: 'Security & Auth', icon: Shield },
        { to: '/app/profile', label: 'Identity Profile', icon: User },
      ];

  if (isMinimized) {
    return (
      <div className="fixed bottom-3 right-4 z-40">
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          aria-label="Expand OS Dock"
          title="Expand Liquid Dock"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-midnight-950/90 text-electric-teal border border-electric-teal/40 backdrop-blur-xl shadow-os-dock hover:scale-105 transition-all text-xs font-mono"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-neon animate-pulse" />
          <span>Dock</span>
          <ChevronUp className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 select-none">
      <div className="relative group">
        {/* Glow ambient background aura */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-electric-teal/20 via-emerald-neon/15 to-electric-teal/20 blur-md opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <div className="relative flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-2xl bg-midnight-950/85 backdrop-blur-2xl border border-electric-teal/30 shadow-os-dock">
          {/* Dock Apps */}
          {dockItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.to ||
              (item.to !== '/app' && item.to !== '/admin' && location.pathname.startsWith(item.to));

            // Dynamic spring scale based on proximity to hovered index
            let scaleClass = 'scale-100';
            let translateYClass = 'translate-y-0';
            if (hoveredIdx === idx) {
              scaleClass = 'scale-125';
              translateYClass = '-translate-y-2';
            } else if (hoveredIdx !== null && Math.abs(hoveredIdx - idx) === 1) {
              scaleClass = 'scale-110';
              translateYClass = '-translate-y-1';
            }

            return (
              <div
                key={item.to}
                className="relative flex flex-col items-center"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Tooltip on hover */}
                {hoveredIdx === idx && (
                  <div className="absolute -top-10 px-2.5 py-1 rounded-lg bg-midnight-900/95 text-white border border-electric-teal/40 text-[11px] font-sans font-semibold tracking-wide whitespace-nowrap shadow-lg animate-fade-in pointer-events-none">
                    {item.label}
                    <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 border-4 border-transparent border-t-midnight-900" />
                  </div>
                )}

                <NavLink
                  to={item.to}
                  aria-label={item.label}
                  className={`p-2.5 rounded-xl transition-all duration-200 ease-out flex items-center justify-center relative ${scaleClass} ${translateYClass} ${
                    isActive
                      ? 'bg-gradient-to-tr from-electric-teal to-emerald-neon text-midnight-950 shadow-electric-glow'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5 transition-transform" />
                </NavLink>

                {/* Active Indicator Dot */}
                <div
                  className={`w-1 h-1 rounded-full mt-1 transition-all ${
                    isActive ? 'bg-electric-teal shadow-electric-glow scale-125' : 'bg-transparent'
                  }`}
                />
              </div>
            );
          })}

          {/* Separator */}
          <div className="w-[1px] h-7 bg-white/15 mx-1" />

          {/* Lock Screen Dock Action */}
          <div
            className="relative flex flex-col items-center"
            onMouseEnter={() => setHoveredIdx(999)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {hoveredIdx === 999 && (
              <div className="absolute -top-10 px-2.5 py-1 rounded-lg bg-midnight-900/95 text-rose-300 border border-rose-500/40 text-[11px] font-sans font-semibold tracking-wide whitespace-nowrap shadow-lg animate-fade-in pointer-events-none">
                Lock Enclave (Sign Out)
                <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 border-4 border-transparent border-t-midnight-900" />
              </div>
            )}
            <button
              type="button"
              onClick={handleLock}
              aria-label="Lock Enclave"
              className={`p-2.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 transition-all duration-200 ease-out flex items-center justify-center ${
                hoveredIdx === 999 ? 'scale-125 -translate-y-2' : 'scale-100 translate-y-0'
              }`}
            >
              <Lock className="w-5 h-5" />
            </button>
            <div className="w-1 h-1 mt-1 bg-transparent" />
          </div>

          {/* Minimize Button */}
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            aria-label="Minimize Dock"
            title="Minimize Dock"
            className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors ml-0.5"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
