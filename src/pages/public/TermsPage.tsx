import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Terms of Service & Usage
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Transparent guidelines governing personal data deletion requests
        </p>
      </div>

      <GlassCard variant="default" className="p-8 space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            1. Authorized Use & Impersonation Prohibition
          </h2>
          <p>
            You agree to submit deletion requests only for accounts and personal data for which you are the lawful Data Principal or an authorized legal representative. Submitting fraudulent requests or attempting to tamper with another individual's data constitutes a violation of these terms and applicable cyber laws.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            2. Irreversibility of Confirmed Erasure
          </h2>
          <p>
            Once a deletion request is cryptographically verified and executed across our live data stores, personal identifiers and session records cannot be recovered or restored. You acknowledge that account deletion terminates access to associated services.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            3. Processing Timelines & SLAs
          </h2>
          <p>
            In accordance with best practices and regulatory guidance, PrivacyGuard processes deletion requests within 30 days of successful identity verification, barring documented statutory retention review.
          </p>
        </section>
      </GlassCard>
    </div>
  );
};
