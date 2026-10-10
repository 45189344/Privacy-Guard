-- ====================================================================
-- PRIVACYGUARD: PRODUCTION POSTGRESQL & SUPABASE RLS SCHEMA
-- Migration: 20261011_privacyguard_schema.sql
-- Aligned with Digital Personal Data Protection (DPDP) Act 2023 Principles
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'dpo_admin', 'auditor')),
  organization_id TEXT,
  phone_number TEXT,
  identity_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. DELETION REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.deletion_requests (
  id TEXT PRIMARY KEY, -- Non-guessable reference code, e.g. "PG-2026-8942-X7"
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'ACCOUNT_AND_ALL_DATA',
    'MARKETING_AND_TELEMETRY',
    'FINANCIAL_TRANSACTION_RECORDS',
    'CUSTOMER_SUPPORT_COMMUNICATIONS',
    'IDENTITY_AND_KYC_DOCUMENTS',
    'CUSTOM_SELECTION'
  )),
  scope_details TEXT NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN (
    'SUBMITTED',
    'VERIFICATION_PENDING',
    'VERIFIED',
    'UNDER_REVIEW',
    'APPROVED',
    'DELETION_IN_PROGRESS',
    'COMPLETED',
    'NEEDS_INFORMATION',
    'REJECTED',
    'PARTIALLY_COMPLETED',
    'FAILED',
    'CANCELLED'
  )),
  verification_method TEXT NOT NULL CHECK (verification_method IN ('EMAIL_OTP', 'AUTH_CHALLENGE', 'MFA_CONFIRMATION')),
  verification_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'FAILED')),
  verified_at TIMESTAMPTZ,
  reviewer_id UUID REFERENCES public.profiles(id),
  reviewer_name TEXT,
  review_notes TEXT,
  rejection_reason TEXT,
  target_systems TEXT[] NOT NULL DEFAULT ARRAY['Primary PostgreSQL DB', 'Redis Cache', 'ElasticSearch Cluster'],
  retention_exception_id TEXT,
  completion_summary JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for tenancy lookups
CREATE INDEX IF NOT EXISTS idx_requests_user_id ON public.deletion_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.deletion_requests(status);

-- 3. STATUS HISTORY (Deterministic State Transitions)
CREATE TABLE IF NOT EXISTS public.request_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id TEXT NOT NULL REFERENCES public.deletion_requests(id) ON DELETE CASCADE,
  previous_status TEXT NOT NULL,
  new_status TEXT NOT NULL,
  actor_id UUID NOT NULL REFERENCES public.profiles(id),
  actor_role TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_status_history_req ON public.request_status_history(request_id);

-- 4. RETENTION EXCEPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.retention_exceptions (
  id TEXT PRIMARY KEY, -- e.g. "RET-2026-041"
  request_id TEXT NOT NULL REFERENCES public.deletion_requests(id) ON DELETE CASCADE,
  affected_data_category TEXT NOT NULL,
  documented_basis TEXT NOT NULL, -- Statutory justification (e.g. DPDP Sec 8(7) read with IT Act)
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id),
  reviewer_name TEXT NOT NULL,
  decision_timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  scope_of_retained_data TEXT NOT NULL,
  scheduled_review_date TIMESTAMPTZ NOT NULL,
  final_disposition TEXT NOT NULL CHECK (final_disposition IN (
    'SCHEDULED_FOR_LATER_PURGE',
    'PERMANENT_REGULATORY_ARCHIVE',
    'PSEUDONYMIZED'
  ))
);

-- 5. DELETION JOBS TABLE (Worker Orchestration)
CREATE TABLE IF NOT EXISTS public.deletion_jobs (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL REFERENCES public.deletion_requests(id) ON DELETE CASCADE,
  target_system TEXT NOT NULL,
  operation_type TEXT NOT NULL CHECK (operation_type IN (
    'HARD_DELETE',
    'CRYPTOGRAPHIC_ERASURE',
    'ANONYMIZATION',
    'RETENTION_TOMBSTONE'
  )),
  execution_state TEXT NOT NULL DEFAULT 'PENDING' CHECK (execution_state IN (
    'PENDING',
    'RUNNING',
    'SUCCESS',
    'FAILED',
    'RETRY_REQUIRED',
    'PARTIALLY_COMPLETED',
    'PENDING_VERIFICATION'
  )),
  attempt_count INT NOT NULL DEFAULT 0,
  max_attempts INT NOT NULL DEFAULT 3,
  last_attempt_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_category TEXT NOT NULL DEFAULT 'NONE',
  error_message TEXT,
  verification_result JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_jobs_request ON public.deletion_jobs(request_id);

-- 6. APPEND-ONLY AUDIT EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.audit_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  actor_email TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  request_id TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  outcome TEXT NOT NULL CHECK (outcome IN ('SUCCESS', 'FAILURE', 'BLOCKED', 'FLAGGED')),
  correlation_id TEXT NOT NULL,
  ip_address_masked TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON public.audit_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_req ON public.audit_events(request_id);

-- 7. IN-APP NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  request_id TEXT REFERENCES public.deletion_requests(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('INFO', 'ACTION_REQUIRED', 'SUCCESS', 'WARNING', 'ERROR')),
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retention_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deletion_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper function: Is caller DPO Admin?
CREATE OR REPLACE FUNCTION public.is_dpo_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('dpo_admin', 'auditor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can read and update only their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_dpo_admin());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())); -- Cannot elevate role

-- Deletion Requests:
CREATE POLICY "Users read own requests, Admins read all"
  ON public.deletion_requests FOR SELECT
  USING (auth.uid() = user_id OR public.is_dpo_admin());

CREATE POLICY "Users can insert requests for themselves"
  ON public.deletion_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id AND status IN ('SUBMITTED', 'VERIFICATION_PENDING', 'VERIFIED'));

CREATE POLICY "Admins can update requests, users can only cancel"
  ON public.deletion_requests FOR UPDATE
  USING (public.is_dpo_admin() OR (auth.uid() = user_id AND status IN ('SUBMITTED', 'VERIFICATION_PENDING', 'UNDER_REVIEW')))
  WITH CHECK (
    public.is_dpo_admin() OR
    (auth.uid() = user_id AND status = 'CANCELLED')
  );

-- Retention Exceptions: Only Admins can view and write
CREATE POLICY "Admins can view and insert retentions"
  ON public.retention_exceptions FOR ALL
  USING (public.is_dpo_admin());

-- Deletion Jobs: Only Admins and worker services
CREATE POLICY "Admins can view and manage deletion jobs"
  ON public.deletion_jobs FOR ALL
  USING (public.is_dpo_admin());

-- Audit Events: Users can see only their related audit entries, Admins can view all
CREATE POLICY "Audit events read permissions"
  ON public.audit_events FOR SELECT
  USING (
    public.is_dpo_admin() OR
    actor_id = auth.uid()::text
  );

CREATE POLICY "Authenticated users and services can insert audit records"
  ON public.audit_events FOR INSERT
  WITH CHECK (true);

-- IMMUTABLE AUDIT: REVOKE UPDATE AND DELETE on audit_events
REVOKE UPDATE, DELETE ON public.audit_events FROM public, authenticated, anon;
