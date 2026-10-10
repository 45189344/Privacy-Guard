import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { User, Mail, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Data Principal Identity Profile
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Verified identifiers linked to your personal data erasure footprint
        </p>
      </div>

      <GlassCard variant="elevated" className="p-8 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-400 text-white font-black text-2xl flex items-center justify-center shadow-teal-glow">
            {user?.fullName.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {user?.fullName}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                ID: {user?.id}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                <span>VERIFIED IDENTITY</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-midnight-950/60 border border-slate-200/60 dark:border-white/5 space-y-1">
            <div className="text-slate-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>Registered Email</span>
            </div>
            <div className="font-semibold text-slate-900 dark:text-white text-sm">
              {user?.email}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-midnight-950/60 border border-slate-200/60 dark:border-white/5 space-y-1">
            <div className="text-slate-400 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>Contact Phone</span>
            </div>
            <div className="font-semibold text-slate-900 dark:text-white text-sm">
              {user?.phoneNumber || '+91 98201 44521'}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-800 dark:text-teal-300 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">DPDP Data Principal Assurance</div>
            <p className="text-[11px] mt-0.5 opacity-90 leading-relaxed">
              Your profile is verified. All requests dispatched under this identifier carry non-repudiable audit logs accessible only to you and authorized compliance officers.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
