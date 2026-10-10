// Core Type Definitions for PrivacyGuard

export type UserRole = 'user' | 'dpo_admin' | 'auditor';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  orgId?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  identityVerified: boolean;
  createdAt: string;
}

export type RequestStatus =
  | 'SUBMITTED'
  | 'VERIFICATION_PENDING'
  | 'VERIFIED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'DELETION_IN_PROGRESS'
  | 'COMPLETED'
  | 'NEEDS_INFORMATION'
  | 'REJECTED'
  | 'PARTIALLY_COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export type RequestCategory =
  | 'ACCOUNT_AND_ALL_DATA'
  | 'MARKETING_AND_TELEMETRY'
  | 'FINANCIAL_TRANSACTION_RECORDS'
  | 'CUSTOMER_SUPPORT_COMMUNICATIONS'
  | 'IDENTITY_AND_KYC_DOCUMENTS'
  | 'CUSTOM_SELECTION';

export interface DeletionRequest {
  id: string; // e.g. "PG-2026-8942-X7"
  userId: string;
  userEmail: string;
  userName: string;
  category: RequestCategory;
  scopeDetails: string;
  reason?: string;
  status: RequestStatus;
  verificationMethod: 'EMAIL_OTP' | 'AUTH_CHALLENGE' | 'MFA_CONFIRMATION';
  verificationStatus: 'PENDING' | 'VERIFIED' | 'FAILED';
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
  reviewerId?: string;
  reviewerName?: string;
  reviewNotes?: string;
  rejectionReason?: string;
  targetSystems: string[];
  retentionExceptionId?: string;
  completionSummary?: {
    totalStores: number;
    deletedStores: number;
    retainedStores: number;
    verificationProofHash: string;
    completedAt: string;
  };
}

export type JobExecutionState =
  | 'PENDING'
  | 'RUNNING'
  | 'SUCCESS'
  | 'FAILED'
  | 'RETRY_REQUIRED'
  | 'PARTIALLY_COMPLETED'
  | 'PENDING_VERIFICATION';

export type JobOperationType =
  | 'HARD_DELETE'
  | 'CRYPTOGRAPHIC_ERASURE'
  | 'ANONYMIZATION'
  | 'RETENTION_TOMBSTONE';

export type JobErrorCategory =
  | 'TIMEOUT'
  | 'STORAGE_OFFLINE'
  | 'FOREIGN_KEY_VIOLATION'
  | 'PERMISSION_DENIED'
  | 'RETRY_EXHAUSTED'
  | 'NONE';

export interface DeletionJob {
  id: string;
  requestId: string;
  targetSystem: string;
  operationType: JobOperationType;
  executionState: JobExecutionState;
  attemptCount: number;
  maxAttempts: number;
  createdAt: string;
  lastAttemptAt?: string;
  completedAt?: string;
  errorCategory: JobErrorCategory;
  errorMessage?: string;
  verificationResult?: {
    verified: boolean;
    hash: string;
    verifiedBy: string;
    timestamp: string;
  };
}

export type RetentionDisposition =
  | 'SCHEDULED_FOR_LATER_PURGE'
  | 'PERMANENT_REGULATORY_ARCHIVE'
  | 'PSEUDONYMIZED';

export interface RetentionException {
  id: string;
  requestId: string;
  affectedDataCategory: string;
  documentedBasis: string; // statutory legal basis
  reviewerId: string;
  reviewerName: string;
  decisionTimestamp: string;
  scopeOfRetainedData: string;
  scheduledReviewDate: string;
  finalDisposition: RetentionDisposition;
}

export type AuditEventType =
  | 'REQUEST_SUBMITTED'
  | 'IDENTITY_VERIFIED'
  | 'REQUEST_REVIEWED'
  | 'STATUS_CHANGED'
  | 'RETENTION_EXCEPTION_CREATED'
  | 'DELETION_JOB_SCHEDULED'
  | 'DELETION_JOB_EXECUTED'
  | 'JOB_RETRY_INITIATED'
  | 'VERIFICATION_CONFIRMED'
  | 'DATA_EXPORTED'
  | 'ADMIN_ROLE_ACCESSED'
  | 'USER_LOGOUT'
  | 'USER_LOGIN';

export interface AuditEvent {
  id: string;
  eventType: AuditEventType;
  actorId: string;
  actorEmail: string;
  actorRole: string;
  requestId?: string;
  timestamp: string;
  outcome: 'SUCCESS' | 'FAILURE' | 'BLOCKED' | 'FLAGGED';
  correlationId: string;
  ipAddressMasked: string;
  metadata: Record<string, unknown>;
}

export interface NotificationItem {
  id: string;
  userId: string;
  requestId?: string;
  title: string;
  message: string;
  type: 'INFO' | 'ACTION_REQUIRED' | 'SUCCESS' | 'WARNING' | 'ERROR';
  read: boolean;
  createdAt: string;
}

export interface SystemMetrics {
  totalRequests: number;
  pendingRequests: number;
  underReviewRequests: number;
  processingRequests: number;
  completedRequests: number;
  failedRequests: number;
  retentionExceptionsCount: number;
  averageProcessingDays: number;
  verificationSuccessRate: number;
  deletionSuccessRate: number;
  monthlyTrend: {
    month: string;
    received: number;
    completed: number;
    exceptions: number;
  }[];
  statusDistribution: {
    name: string;
    value: number;
    color: string;
  }[];
}
