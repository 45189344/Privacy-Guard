import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/80 dark:border-white/10 bg-white/50 dark:bg-midnight-950/80 backdrop-blur-xl py-12 px-4 sm:px-6 lg:px-8 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-500 text-white">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-slate-900 dark:text-white tracking-tight">
              PrivacyGuard
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Data Deletion Request Management System. Engineered for transparent, verifiable personal data erasure aligned with India's DPDP Act 2023 framework.
          </p>
          <div className="text-[11px] text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} PrivacyGuard. All rights reserved.
          </div>
        </div>

        {/* Product Navigation */}
        <div className="space-y-2 text-xs">
          <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
            Product
          </div>
          <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
            <li>
              <Link to="/features" className="hover:text-teal-500 transition-colors">
                System Capabilities
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="hover:text-teal-500 transition-colors">
                Request Lifecycle
              </Link>
            </li>
            <li>
              <Link to="/app/requests/new" className="hover:text-teal-500 transition-colors">
                Submit Deletion Request
              </Link>
            </li>
            <li>
              <Link to="/app" className="hover:text-teal-500 transition-colors">
                Principal Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Security & Governance */}
        <div className="space-y-2 text-xs">
          <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
            Security & Compliance
          </div>
          <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
            <li>
              <Link to="/security" className="hover:text-teal-500 transition-colors">
                Security Architecture
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-teal-500 transition-colors">
                Privacy Notice & Rights
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-teal-500 transition-colors">
                Terms of Use
              </Link>
            </li>
            <li>
              <a
                href="#dpdp-framework"
                className="hover:text-teal-500 transition-colors flex items-center gap-1"
              >
                <span>DPDP Act 2023 Reference</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Architectural Disclosures */}
        <div className="space-y-2 text-xs">
          <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
            Transparency Notice
          </div>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
            PrivacyGuard verifies deletion against actively managed data stores. Encrypted offsite disaster-recovery archives rotate automatically per statutory retention policies.
          </p>
          <div className="flex items-center gap-2 pt-1 text-[11px] text-teal-600 dark:text-teal-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Cryptographically Audited</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
