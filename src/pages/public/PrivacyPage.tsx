import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Shield, FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Privacy Notice & Principal Rights
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Governed under the principles of the Digital Personal Data Protection (DPDP) Act, 2023
        </p>
      </div>

      <GlassCard variant="default" className="p-8 space-y-8 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            1. Data Minimization & Collection
          </h2>
          <p>
            PrivacyGuard only collects the minimal personal information necessary to authenticate you, verify your identity, and process your deletion request (email, full name, and request context). We never request unnecessary copies of unredacted identity cards unless legally required.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            2. Your Rights as a Data Principal
          </h2>
          <ul className="space-y-2 mt-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
              <span><strong>Right to Erasure (Section 12):</strong> You may request the deletion of your personal data when it is no longer necessary for the purpose for which it was collected.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
              <span><strong>Right to Grievance Redressal (Section 13):</strong> You may challenge any retention exception or rejection with our Data Protection Officer.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
              <span><strong>Right to Nominate (Section 14):</strong> You may designate a representative in case of incapacity or death to manage your data rights.</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            3. Statutory Exceptions to Deletion (Section 8(7))
          </h2>
          <p>
            Certain records must be retained pursuant to applicable Indian laws, such as the Income Tax Act (7-year fiscal record retention), Prevention of Money Laundering Act (PMLA), or active legal proceedings. When an exception applies, your data is isolated from marketing and operations, and documented in our Retention Holds registry.
          </p>
        </section>

        <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex justify-between items-center">
          <span className="text-xs text-slate-400">Effective Date: October 2026</span>
          <Link
            to="/app/requests/new"
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-teal-glow transition-all"
          >
            Exercise Right to Erasure
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};
