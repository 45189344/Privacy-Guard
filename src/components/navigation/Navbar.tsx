import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useNotifications } from '@/context/NotificationContext';
import { Shield, Sun, Moon, Bell, LogIn, LayoutDashboard, ShieldCheck, User, Menu, X } from 'lucide-react';
import { NotificationModal } from '@/components/ui/NotificationModal';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isDPOAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isPublicPage = !location.pathname.startsWith('/app') && !location.pathname.startsWith('/admin');

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-white/70 dark:bg-midnight-950/75 border-b border-slate-200/80 dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-electric-teal to-emerald-neon text-midnight-950 shadow-electric-glow transition-transform group-hover:scale-105">
              <Shield className="w-5 h-5 fill-midnight-950/20" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                PrivacyGuard
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-electric-teal/15 text-electric-teal font-semibold border border-electric-teal/30">
                  DPDP
                </span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium -mt-0.5">
                Your Data. Your Control.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links (for Public pages) */}
          {isPublicPage && (
            <nav className="hidden md:flex items-center space-x-7 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <Link
                to="/features"
                className={`transition-colors hover:text-teal-600 dark:hover:text-teal-400 ${
                  location.pathname === '/features' ? 'text-teal-600 dark:text-teal-400' : ''
                }`}
              >
                Features
              </Link>
              <Link
                to="/how-it-works"
                className={`transition-colors hover:text-teal-600 dark:hover:text-teal-400 ${
                  location.pathname === '/how-it-works' ? 'text-teal-600 dark:text-teal-400' : ''
                }`}
              >
                How It Works
              </Link>
              <Link
                to="/security"
                className={`transition-colors hover:text-teal-600 dark:hover:text-teal-400 ${
                  location.pathname === '/security' ? 'text-teal-600 dark:text-teal-400' : ''
                }`}
              >
                Security Architecture
              </Link>
              <Link
                to="/privacy"
                className={`transition-colors hover:text-teal-600 dark:hover:text-teal-400 ${
                  location.pathname === '/privacy' ? 'text-teal-600 dark:text-teal-400' : ''
                }`}
              >
                Privacy Notice
              </Link>
            </nav>
          )}

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle light and dark theme"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-midnight-850 border border-slate-200/60 dark:border-white/10 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Notification Bell */}
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => setIsNotifOpen(true)}
                aria-label={`Open notifications (${unreadCount} unread)`}
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-midnight-850 border border-slate-200/60 dark:border-white/10 transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-teal-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* Auth / Workspace Navigation Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {isDPOAdmin ? (
                  <Link
                    to="/admin"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 dark:bg-teal-400/10 border border-teal-500/30 text-teal-700 dark:text-teal-300 hover:bg-teal-500/20 text-xs font-semibold transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>DPO Workspace</span>
                  </Link>
                ) : (
                  <Link
                    to="/app"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 dark:bg-teal-400/10 border border-teal-500/30 text-teal-700 dark:text-teal-300 hover:bg-teal-500/20 text-xs font-semibold transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>User Portal</span>
                  </Link>
                )}

                <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-white/10">
                  <Link
                    to={isDPOAdmin ? '/admin' : '/app'}
                    className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-midnight-800 transition-colors text-xs font-medium"
                  >
                    <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-midnight-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold border border-slate-300 dark:border-white/10">
                      {user?.fullName.charAt(0)}
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="text-xs text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 font-medium transition-colors hidden sm:inline-block"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-electric-teal to-emerald-neon text-midnight-950 shadow-electric-glow hover:opacity-90 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-white/10"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-4 border-t border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-midnight-950/95 space-y-2 text-sm font-semibold">
            <Link
              to="/features"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-midnight-900"
            >
              Features
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-midnight-900"
            >
              How It Works
            </Link>
            <Link
              to="/security"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-midnight-900"
            >
              Security Architecture
            </Link>
            <Link
              to="/privacy"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-midnight-900"
            >
              Privacy Notice
            </Link>
            {isAuthenticated ? (
              <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-2">
                <Link
                  to={isDPOAdmin ? '/admin' : '/app'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block p-2 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400"
                >
                  Go to {isDPOAdmin ? 'DPO Workspace' : 'User Portal'}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left p-2 rounded-lg text-rose-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded-xl bg-slate-100 dark:bg-midnight-800 text-xs"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded-xl bg-teal-600 text-white text-xs"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Slide-out Notifications Modal */}
      <NotificationModal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};
