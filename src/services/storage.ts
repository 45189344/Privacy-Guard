import {
  UserProfile,
  DeletionRequest,
  DeletionJob,
  RetentionException,
  AuditEvent,
  NotificationItem,
  SystemMetrics,
} from '@/types';

const STORAGE_KEYS = {
  USERS: 'privacyguard_users_v1',
  CURRENT_USER: 'privacyguard_current_user_v1',
  REQUESTS: 'privacyguard_requests_v1',
  JOBS: 'privacyguard_jobs_v1',
  RETENTIONS: 'privacyguard_retentions_v1',
  AUDIT: 'privacyguard_audit_v1',
  NOTIFICATIONS: 'privacyguard_notifications_v1',
};

// Seed Users
export const SEED_USERS: UserProfile[] = [
  {
    id: 'usr_priya_01',
    email: 'priya.sharma@example.com',
    fullName: 'Priya Sharma',
    role: 'user',
    phoneNumber: '+91 98201 44521',
    identityVerified: true,
    createdAt: '2026-01-15T09:30:00Z',
  },
  {
    id: 'usr_arjun_02',
    email: 'arjun.patel@example.com',
    fullName: 'Arjun Patel',
    role: 'user',
    phoneNumber: '+91 94102 88712',
    identityVerified: false,
    createdAt: '2026-02-01T14:15:00Z',
  },
  {
    id: 'usr_admin_dpo',
    email: 'dpo.vikram@privacyguard.internal',
    fullName: 'Dr. Vikram Malhotra',
    role: 'dpo_admin',
    orgId: 'org_in_dpdp_gov',
    phoneNumber: '+91 11 2345 6789',
    identityVerified: true,
    createdAt: '2025-11-01T08:00:00Z',
  },
  {
    id: 'usr_auditor_01',
    email: 'auditor.sunita@privacyguard.internal',
    fullName: 'Sunita Rao',
    role: 'auditor',
    orgId: 'org_in_dpdp_gov',
    phoneNumber: '+91 80 4123 9000',
    identityVerified: true,
    createdAt: '2025-12-10T10:00:00Z',
  },
];

// Seed Requests
export const SEED_REQUESTS: DeletionRequest[] = [
  {
    id: 'PG-2026-8942-X7',
    userId: 'usr_priya_01',
    userEmail: 'priya.sharma@example.com',
    userName: 'Priya Sharma',
    category: 'ACCOUNT_AND_ALL_DATA',
    scopeDetails: 'Full account profile, authentication credentials, telemetry, and past shopping sessions.',
    reason: 'Exercising Right to Erasure under DPDP Section 12 after switching service providers.',
    status: 'COMPLETED',
    verificationMethod: 'EMAIL_OTP',
    verificationStatus: 'VERIFIED',
    verifiedAt: '2026-03-01T10:15:00Z',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-03T16:20:00Z',
    reviewerId: 'usr_admin_dpo',
    reviewerName: 'Dr. Vikram Malhotra',
    reviewNotes: 'Verified identity and confirmed absence of pending legal holds. Full erasure approved.',
    targetSystems: ['Primary PostgreSQL DB', 'Redis Cache', 'ElasticSearch Cluster', 'S3 Object Storage'],
    completionSummary: {
      totalStores: 4,
      deletedStores: 4,
      retainedStores: 0,
      verificationProofHash: 'sha256_8f3d1b99a6c743e028bfa17c09d56214ec0e24b912c9c7f99968a3f82e7b1a20',
      completedAt: '2026-03-03T16:20:00Z',
    },
  },
  {
    id: 'PG-2026-9103-B2',
    userId: 'usr_priya_01',
    userEmail: 'priya.sharma@example.com',
    userName: 'Priya Sharma',
    category: 'FINANCIAL_TRANSACTION_RECORDS',
    scopeDetails: 'Erasure of payment histories, GST invoices, and wallet ledgers.',
    reason: 'Privacy hygiene after closing secondary virtual cards.',
    status: 'PARTIALLY_COMPLETED',
    verificationMethod: 'AUTH_CHALLENGE',
    verificationStatus: 'VERIFIED',
    verifiedAt: '2026-03-10T11:45:00Z',
    createdAt: '2026-03-10T11:30:00Z',
    updatedAt: '2026-03-14T14:10:00Z',
    reviewerId: 'usr_admin_dpo',
    reviewerName: 'Dr. Vikram Malhotra',
    reviewNotes: 'Marketing tokens deleted; statutory invoice records retained pursuant to IT Act & Section 8(7) DPDP.',
    targetSystems: ['Primary PostgreSQL DB', 'Financial Ledger Archive', 'ElasticSearch Cluster'],
    retentionExceptionId: 'RET-2026-041',
    completionSummary: {
      totalStores: 3,
      deletedStores: 2,
      retainedStores: 1,
      verificationProofHash: 'sha256_e4c3917a419082bd91efc78105ab267c79310a0df65b6f3a7d9039600e12d8a4',
      completedAt: '2026-03-14T14:10:00Z',
    },
  },
  {
    id: 'PG-2026-9450-K9',
    userId: 'usr_priya_01',
    userEmail: 'priya.sharma@example.com',
    userName: 'Priya Sharma',
    category: 'MARKETING_AND_TELEMETRY',
    scopeDetails: 'Ad tracking cookies, location breadcrumbs, and cross-device advertising graph entries.',
    reason: 'Opting out of behavioral ad retargeting permanently.',
    status: 'DELETION_IN_PROGRESS',
    verificationMethod: 'MFA_CONFIRMATION',
    verificationStatus: 'VERIFIED',
    verifiedAt: '2026-03-20T08:30:00Z',
    createdAt: '2026-03-20T08:15:00Z',
    updatedAt: '2026-03-21T12:00:00Z',
    reviewerId: 'usr_admin_dpo',
    reviewerName: 'Dr. Vikram Malhotra',
    reviewNotes: 'Approved. Dispatched deletion jobs across 3 telemetry clusters.',
    targetSystems: ['ElasticSearch Cluster', 'Redis Cache', 'BigQuery Event Stream'],
  },
  {
    id: 'PG-2026-9721-M4',
    userId: 'usr_arjun_02',
    userEmail: 'arjun.patel@example.com',
    userName: 'Arjun Patel',
    category: 'CUSTOMER_SUPPORT_COMMUNICATIONS',
    scopeDetails: 'Audio recordings of calls, ticket resolution notes, and customer support chat logs.',
    status: 'UNDER_REVIEW',
    verificationMethod: 'EMAIL_OTP',
    verificationStatus: 'VERIFIED',
    verifiedAt: '2026-03-22T14:10:00Z',
    createdAt: '2026-03-22T13:45:00Z',
    updatedAt: '2026-03-23T09:00:00Z',
    reviewerId: 'usr_admin_dpo',
    reviewerName: 'Dr. Vikram Malhotra',
    reviewNotes: 'Assigned to security compliance officer for ticket ledger review.',
    targetSystems: ['Support CRM Zendesk', 'S3 Audio Vault'],
  },
  {
    id: 'PG-2026-9884-L1',
    userId: 'usr_arjun_02',
    userEmail: 'arjun.patel@example.com',
    userName: 'Arjun Patel',
    category: 'IDENTITY_AND_KYC_DOCUMENTS',
    scopeDetails: 'Aadhaar / Passport scan copies and selfie biometrics after loan closing.',
    status: 'VERIFICATION_PENDING',
    verificationMethod: 'AUTH_CHALLENGE',
    verificationStatus: 'PENDING',
    createdAt: '2026-03-25T16:00:00Z',
    updatedAt: '2026-03-25T16:00:00Z',
    targetSystems: ['Encrypted KYC Vault', 'DocStorage S3'],
  },
];

// Seed Deletion Jobs
export const SEED_JOBS: DeletionJob[] = [
  {
    id: 'JOB-9450-01',
    requestId: 'PG-2026-9450-K9',
    targetSystem: 'ElasticSearch Cluster',
    operationType: 'HARD_DELETE',
    executionState: 'SUCCESS',
    attemptCount: 1,
    maxAttempts: 3,
    createdAt: '2026-03-21T12:05:00Z',
    lastAttemptAt: '2026-03-21T12:05:10Z',
    completedAt: '2026-03-21T12:05:12Z',
    errorCategory: 'NONE',
    verificationResult: {
      verified: true,
      hash: 'sha256_es_49f8a32b001c9a',
      verifiedBy: 'system_daemon',
      timestamp: '2026-03-21T12:05:15Z',
    },
  },
  {
    id: 'JOB-9450-02',
    requestId: 'PG-2026-9450-K9',
    targetSystem: 'Redis Cache',
    operationType: 'CRYPTOGRAPHIC_ERASURE',
    executionState: 'RUNNING',
    attemptCount: 1,
    maxAttempts: 3,
    createdAt: '2026-03-21T12:05:00Z',
    lastAttemptAt: '2026-03-21T12:06:00Z',
    errorCategory: 'NONE',
  },
  {
    id: 'JOB-9450-03',
    requestId: 'PG-2026-9450-K9',
    targetSystem: 'BigQuery Event Stream',
    operationType: 'ANONYMIZATION',
    executionState: 'RETRY_REQUIRED',
    attemptCount: 2,
    maxAttempts: 3,
    createdAt: '2026-03-21T12:05:00Z',
    lastAttemptAt: '2026-03-21T12:07:30Z',
    errorCategory: 'TIMEOUT',
    errorMessage: 'Connection deadline exceeded during partition-level scan. Queued for automatic backoff retry.',
  },
  {
    id: 'JOB-8942-01',
    requestId: 'PG-2026-8942-X7',
    targetSystem: 'Primary PostgreSQL DB',
    operationType: 'HARD_DELETE',
    executionState: 'SUCCESS',
    attemptCount: 1,
    maxAttempts: 3,
    createdAt: '2026-03-03T16:15:00Z',
    completedAt: '2026-03-03T16:16:00Z',
    errorCategory: 'NONE',
    verificationResult: {
      verified: true,
      hash: 'sha256_pg_991823abce1287',
      verifiedBy: 'system_daemon',
      timestamp: '2026-03-03T16:16:05Z',
    },
  },
  {
    id: 'JOB-8942-02',
    requestId: 'PG-2026-8942-X7',
    targetSystem: 'S3 Object Storage',
    operationType: 'CRYPTOGRAPHIC_ERASURE',
    executionState: 'SUCCESS',
    attemptCount: 1,
    maxAttempts: 3,
    createdAt: '2026-03-03T16:15:00Z',
    completedAt: '2026-03-03T16:18:00Z',
    errorCategory: 'NONE',
    verificationResult: {
      verified: true,
      hash: 'sha256_s3_8716bca9109028',
      verifiedBy: 'system_daemon',
      timestamp: '2026-03-03T16:18:10Z',
    },
  },
];

// Seed Retention Exceptions
export const SEED_RETENTIONS: RetentionException[] = [
  {
    id: 'RET-2026-041',
    requestId: 'PG-2026-9103-B2',
    affectedDataCategory: 'Financial Transaction Ledgers & Tax Invoices',
    documentedBasis: 'DPDP Act Section 8(7) read with Indian Income Tax Act 1961 Section 44AA (7-year statutory audit retention)',
    reviewerId: 'usr_admin_dpo',
    reviewerName: 'Dr. Vikram Malhotra',
    decisionTimestamp: '2026-03-14T14:00:00Z',
    scopeOfRetainedData: 'GST tax invoices, payment transaction IDs, and settlement ledger timestamps. All personal tracking and analytics severed.',
    scheduledReviewDate: '2033-03-31T00:00:00Z',
    finalDisposition: 'PERMANENT_REGULATORY_ARCHIVE',
  },
];

// Seed Audit Events
export const SEED_AUDIT: AuditEvent[] = [
  {
    id: 'AUD-1001',
    eventType: 'REQUEST_SUBMITTED',
    actorId: 'usr_priya_01',
    actorEmail: 'priya.sharma@example.com',
    actorRole: 'user',
    requestId: 'PG-2026-8942-X7',
    timestamp: '2026-03-01T10:00:00Z',
    outcome: 'SUCCESS',
    correlationId: 'cor_req_8942_init',
    ipAddressMasked: '103.21.***.***',
    metadata: { category: 'ACCOUNT_AND_ALL_DATA', verificationMethod: 'EMAIL_OTP' },
  },
  {
    id: 'AUD-1002',
    eventType: 'IDENTITY_VERIFIED',
    actorId: 'usr_priya_01',
    actorEmail: 'priya.sharma@example.com',
    actorRole: 'user',
    requestId: 'PG-2026-8942-X7',
    timestamp: '2026-03-01T10:15:00Z',
    outcome: 'SUCCESS',
    correlationId: 'cor_ver_8942_otp',
    ipAddressMasked: '103.21.***.***',
    metadata: { tokenChallenge: 'PASSED', mfaType: 'EMAIL_OTP' },
  },
  {
    id: 'AUD-1003',
    eventType: 'REQUEST_REVIEWED',
    actorId: 'usr_admin_dpo',
    actorEmail: 'dpo.vikram@privacyguard.internal',
    actorRole: 'dpo_admin',
    requestId: 'PG-2026-8942-X7',
    timestamp: '2026-03-03T16:10:00Z',
    outcome: 'SUCCESS',
    correlationId: 'cor_rev_8942_dpo',
    ipAddressMasked: '14.139.***.***',
    metadata: { action: 'APPROVED', targetStores: 4 },
  },
  {
    id: 'AUD-1004',
    eventType: 'DELETION_JOB_EXECUTED',
    actorId: 'system_daemon',
    actorEmail: 'daemon@internal.privacyguard',
    actorRole: 'system',
    requestId: 'PG-2026-8942-X7',
    timestamp: '2026-03-03T16:20:00Z',
    outcome: 'SUCCESS',
    correlationId: 'cor_job_8942_done',
    ipAddressMasked: '127.0.***.***',
    metadata: { deletedStores: 4, verificationHash: 'sha256_8f3d1b99a6c7' },
  },
  {
    id: 'AUD-1005',
    eventType: 'RETENTION_EXCEPTION_CREATED',
    actorId: 'usr_admin_dpo',
    actorEmail: 'dpo.vikram@privacyguard.internal',
    actorRole: 'dpo_admin',
    requestId: 'PG-2026-9103-B2',
    timestamp: '2026-03-14T14:00:00Z',
    outcome: 'SUCCESS',
    correlationId: 'cor_ret_9103_basis',
    ipAddressMasked: '14.139.***.***',
    metadata: {
      basis: 'Income Tax Act 1961 Section 44AA',
      retainedCategory: 'Financial Transaction Ledgers',
      scheduledReview: '2033-03-31',
    },
  },
];

// Seed Notifications
export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_01',
    userId: 'usr_priya_01',
    requestId: 'PG-2026-8942-X7',
    title: 'Deletion Verified & Completed',
    message: 'Your deletion request PG-2026-8942-X7 has completed across all 4 authorized stores. Verifiable receipt generated.',
    type: 'SUCCESS',
    read: false,
    createdAt: '2026-03-03T16:22:00Z',
  },
  {
    id: 'notif_02',
    userId: 'usr_priya_01',
    requestId: 'PG-2026-9103-B2',
    title: 'Retention Decision Documented',
    message: 'Request PG-2026-9103-B2 has completed partially. Statutory financial records are preserved under Income Tax Act compliance.',
    type: 'INFO',
    read: true,
    createdAt: '2026-03-14T14:15:00Z',
  },
  {
    id: 'notif_03',
    userId: 'usr_arjun_02',
    requestId: 'PG-2026-9884-L1',
    title: 'Action Required: Verification Pending',
    message: 'Please complete the identity challenge for request PG-2026-9884-L1 to proceed to DPO review.',
    type: 'ACTION_REQUIRED',
    read: false,
    createdAt: '2026-03-25T16:05:00Z',
  },
];

// Helper to safely get / set localStorage
function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch {
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }
}

// Storage API
export const StorageService = {
  // Reset all to seed
  resetToSeeds(): void {
    setStorageItem(STORAGE_KEYS.USERS, SEED_USERS);
    setStorageItem(STORAGE_KEYS.REQUESTS, SEED_REQUESTS);
    setStorageItem(STORAGE_KEYS.JOBS, SEED_JOBS);
    setStorageItem(STORAGE_KEYS.RETENTIONS, SEED_RETENTIONS);
    setStorageItem(STORAGE_KEYS.AUDIT, SEED_AUDIT);
    setStorageItem(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    setStorageItem(STORAGE_KEYS.CURRENT_USER, SEED_USERS[0]);
  },

  // Users
  getUsers(): UserProfile[] {
    const users = getStorageItem<UserProfile[]>(STORAGE_KEYS.USERS, []);
    if (users.length === 0) {
      setStorageItem(STORAGE_KEYS.USERS, SEED_USERS);
      return SEED_USERS;
    }
    return users;
  },

  getCurrentUser(): UserProfile {
    const current = getStorageItem<UserProfile | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!current) {
      const defaultUser = SEED_USERS[0];
      setStorageItem(STORAGE_KEYS.CURRENT_USER, defaultUser);
      return defaultUser;
    }
    return current;
  },

  setCurrentUser(user: UserProfile): void {
    setStorageItem(STORAGE_KEYS.CURRENT_USER, user);
  },

  // Requests
  getRequests(): DeletionRequest[] {
    const requests = getStorageItem<DeletionRequest[]>(STORAGE_KEYS.REQUESTS, []);
    if (requests.length === 0) {
      setStorageItem(STORAGE_KEYS.REQUESTS, SEED_REQUESTS);
      return SEED_REQUESTS;
    }
    return requests;
  },

  getRequestById(id: string): DeletionRequest | undefined {
    return this.getRequests().find((r) => r.id === id);
  },

  saveRequest(req: DeletionRequest): void {
    const requests = this.getRequests();
    const index = requests.findIndex((r) => r.id === req.id);
    if (index >= 0) {
      requests[index] = req;
    } else {
      requests.unshift(req);
    }
    setStorageItem(STORAGE_KEYS.REQUESTS, requests);
  },

  // Jobs
  getJobs(): DeletionJob[] {
    const jobs = getStorageItem<DeletionJob[]>(STORAGE_KEYS.JOBS, []);
    if (jobs.length === 0) {
      setStorageItem(STORAGE_KEYS.JOBS, SEED_JOBS);
      return SEED_JOBS;
    }
    return jobs;
  },

  getJobsByRequestId(requestId: string): DeletionJob[] {
    return this.getJobs().filter((j) => j.requestId === requestId);
  },

  saveJob(job: DeletionJob): void {
    const jobs = this.getJobs();
    const index = jobs.findIndex((j) => j.id === job.id);
    if (index >= 0) {
      jobs[index] = job;
    } else {
      jobs.push(job);
    }
    setStorageItem(STORAGE_KEYS.JOBS, jobs);
  },

  // Retention Exceptions
  getRetentions(): RetentionException[] {
    const retentions = getStorageItem<RetentionException[]>(STORAGE_KEYS.RETENTIONS, []);
    if (retentions.length === 0) {
      setStorageItem(STORAGE_KEYS.RETENTIONS, SEED_RETENTIONS);
      return SEED_RETENTIONS;
    }
    return retentions;
  },

  saveRetention(ret: RetentionException): void {
    const retentions = this.getRetentions();
    const index = retentions.findIndex((r) => r.id === ret.id);
    if (index >= 0) {
      retentions[index] = ret;
    } else {
      retentions.unshift(ret);
    }
    setStorageItem(STORAGE_KEYS.RETENTIONS, retentions);
  },

  // Audit Logs (Append-only)
  getAuditEvents(): AuditEvent[] {
    const audit = getStorageItem<AuditEvent[]>(STORAGE_KEYS.AUDIT, []);
    if (audit.length === 0) {
      setStorageItem(STORAGE_KEYS.AUDIT, SEED_AUDIT);
      return SEED_AUDIT;
    }
    return audit;
  },

  logAuditEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): AuditEvent {
    const fullEvent: AuditEvent = {
      ...event,
      id: `AUD-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`,
      timestamp: new Date().toISOString(),
    };
    const audit = this.getAuditEvents();
    audit.unshift(fullEvent);
    setStorageItem(STORAGE_KEYS.AUDIT, audit);
    return fullEvent;
  },

  // Notifications
  getNotifications(): NotificationItem[] {
    const list = getStorageItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    if (list.length === 0) {
      setStorageItem(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
      return SEED_NOTIFICATIONS;
    }
    return list;
  },

  addNotification(notif: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>): NotificationItem {
    const full: NotificationItem = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    const list = this.getNotifications();
    list.unshift(full);
    setStorageItem(STORAGE_KEYS.NOTIFICATIONS, list);
    return full;
  },

  markNotificationRead(id: string): void {
    const list = this.getNotifications();
    const target = list.find((n) => n.id === id);
    if (target) {
      target.read = true;
      setStorageItem(STORAGE_KEYS.NOTIFICATIONS, list);
    }
  },

  markAllNotificationsRead(userId: string): void {
    const list = this.getNotifications();
    list.forEach((n) => {
      if (n.userId === userId) n.read = true;
    });
    setStorageItem(STORAGE_KEYS.NOTIFICATIONS, list);
  },

  // Calculate Metrics
  getMetrics(): SystemMetrics {
    const requests = this.getRequests();
    const retentions = this.getRetentions();
    const totalRequests = requests.length;
    const pendingRequests = requests.filter((r) => r.status === 'VERIFICATION_PENDING').length;
    const underReviewRequests = requests.filter((r) => r.status === 'UNDER_REVIEW').length;
    const processingRequests = requests.filter((r) => r.status === 'DELETION_IN_PROGRESS' || r.status === 'APPROVED').length;
    const completedRequests = requests.filter((r) => r.status === 'COMPLETED' || r.status === 'PARTIALLY_COMPLETED').length;
    const failedRequests = requests.filter((r) => r.status === 'FAILED' || r.status === 'REJECTED').length;

    const verifiedCount = requests.filter((r) => r.verificationStatus === 'VERIFIED').length;
    const verificationSuccessRate = totalRequests > 0 ? Math.round((verifiedCount / totalRequests) * 100) : 100;
    const deletionSuccessRate = totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 100;

    return {
      totalRequests,
      pendingRequests,
      underReviewRequests,
      processingRequests,
      completedRequests,
      failedRequests,
      retentionExceptionsCount: retentions.length,
      averageProcessingDays: 3.2,
      verificationSuccessRate,
      deletionSuccessRate,
      monthlyTrend: [
        { month: 'Nov', received: 14, completed: 12, exceptions: 1 },
        { month: 'Dec', received: 22, completed: 19, exceptions: 2 },
        { month: 'Jan', received: 35, completed: 31, exceptions: 3 },
        { month: 'Feb', received: 48, completed: 42, exceptions: 5 },
        { month: 'Mar', received: 62, completed: 54, exceptions: 6 },
      ],
      statusDistribution: [
        { name: 'Completed', value: completedRequests, color: '#10b981' },
        { name: 'Under Review', value: underReviewRequests, color: '#14b8a6' },
        { name: 'In Progress', value: processingRequests, color: '#3b82f6' },
        { name: 'Pending Verification', value: pendingRequests, color: '#f59e0b' },
        { name: 'Failed / Rejected', value: failedRequests, color: '#f43f5e' },
      ],
    };
  },
};
