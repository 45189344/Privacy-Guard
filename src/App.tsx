import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingFallback } from '@/components/ui/LoadingFallback';

// Layouts
import { PublicLayout } from '@/components/layout/PublicLayout';
import { UserPortalLayout } from '@/components/layout/UserPortalLayout';
import { AdminPortalLayout } from '@/components/layout/AdminPortalLayout';

// Code-Split Public Pages
const LandingPage = lazy(() => import('@/pages/public/LandingPage').then((m) => ({ default: m.LandingPage })));
const FeaturesPage = lazy(() => import('@/pages/public/FeaturesPage').then((m) => ({ default: m.FeaturesPage })));
const HowItWorksPage = lazy(() => import('@/pages/public/HowItWorksPage').then((m) => ({ default: m.HowItWorksPage })));
const SecurityPage = lazy(() => import('@/pages/public/SecurityPage').then((m) => ({ default: m.SecurityPage })));
const PrivacyPage = lazy(() => import('@/pages/public/PrivacyPage').then((m) => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('@/pages/public/TermsPage').then((m) => ({ default: m.TermsPage })));
const NotFoundPage = lazy(() => import('@/pages/public/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

// Code-Split Auth Pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })));
const VerifyEmailPage = lazy(() => import('@/pages/auth/VerifyEmailPage').then((m) => ({ default: m.VerifyEmailPage })));

// Code-Split User Portal Pages
const UserDashboard = lazy(() => import('@/pages/user/UserDashboard').then((m) => ({ default: m.UserDashboard })));
const NewRequestPage = lazy(() => import('@/pages/user/NewRequestPage').then((m) => ({ default: m.NewRequestPage })));
const RequestsListPage = lazy(() => import('@/pages/user/RequestsListPage').then((m) => ({ default: m.RequestsListPage })));
const RequestDetailPage = lazy(() => import('@/pages/user/RequestDetailPage').then((m) => ({ default: m.RequestDetailPage })));
const ProfilePage = lazy(() => import('@/pages/user/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const UserSecurityPage = lazy(() => import('@/pages/user/UserSecurityPage').then((m) => ({ default: m.UserSecurityPage })));
const UserPrivacyPage = lazy(() => import('@/pages/user/UserPrivacyPage').then((m) => ({ default: m.UserPrivacyPage })));

// Code-Split Admin Portal Pages
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const AdminRequestReviewPage = lazy(() => import('@/pages/admin/AdminRequestReviewPage').then((m) => ({ default: m.AdminRequestReviewPage })));
const DeletionJobsPage = lazy(() => import('@/pages/admin/DeletionJobsPage').then((m) => ({ default: m.DeletionJobsPage })));
const RetentionManagementPage = lazy(() => import('@/pages/admin/RetentionManagementPage').then((m) => ({ default: m.RetentionManagementPage })));
const AuditLogsPage = lazy(() => import('@/pages/admin/AuditLogsPage').then((m) => ({ default: m.AuditLogsPage })));
const AnalyticsPage = lazy(() => import('@/pages/admin/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage').then((m) => ({ default: m.AdminUsersPage })));
const AdminSettingsPage = lazy(() => import('@/pages/admin/AdminSettingsPage').then((m) => ({ default: m.AdminSettingsPage })));

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public Routes with PublicLayout */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/features" element={<FeaturesPage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="/security" element={<SecurityPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/verify-email" element={<VerifyEmailPage />} />
                  <Route path="/not-found" element={<NotFoundPage />} />
                </Route>

                {/* Protected User Portal Routes */}
                <Route
                  path="/app"
                  element={
                    <ProtectedRoute>
                      <UserPortalLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<UserDashboard />} />
                  <Route path="requests/new" element={<NewRequestPage />} />
                  <Route path="requests" element={<RequestsListPage />} />
                  <Route path="requests/:requestId" element={<RequestDetailPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="security" element={<UserSecurityPage />} />
                  <Route path="privacy" element={<UserPrivacyPage />} />
                </Route>

                {/* Protected Administrative Routes (requireAdmin = true) */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminPortalLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="requests" element={<AdminDashboard />} />
                  <Route path="requests/:requestId" element={<AdminRequestReviewPage />} />
                  <Route path="deletion-jobs" element={<DeletionJobsPage />} />
                  <Route path="retention" element={<RetentionManagementPage />} />
                  <Route path="audit" element={<AuditLogsPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="users" element={<AdminUsersPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/not-found" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
