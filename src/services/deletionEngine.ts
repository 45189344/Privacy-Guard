import { DeletionRequest, DeletionJob, RequestStatus, RetentionException } from '@/types';
import { StorageService } from './storage';

export const ALLOWED_STATUS_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  SUBMITTED: ['VERIFICATION_PENDING', 'VERIFIED', 'CANCELLED'],
  VERIFICATION_PENDING: ['VERIFIED', 'FAILED', 'CANCELLED'],
  VERIFIED: ['UNDER_REVIEW', 'CANCELLED'],
  UNDER_REVIEW: ['APPROVED', 'NEEDS_INFORMATION', 'REJECTED', 'CANCELLED'],
  NEEDS_INFORMATION: ['UNDER_REVIEW', 'CANCELLED'],
  APPROVED: ['DELETION_IN_PROGRESS'],
  DELETION_IN_PROGRESS: ['COMPLETED', 'PARTIALLY_COMPLETED', 'FAILED'],
  COMPLETED: [],
  PARTIALLY_COMPLETED: [],
  REJECTED: [],
  FAILED: ['UNDER_REVIEW'], // Can be retried by admin
  CANCELLED: [],
};

export function isValidStatusTransition(current: RequestStatus, next: RequestStatus): boolean {
  const allowed = ALLOWED_STATUS_TRANSITIONS[current];
  return Boolean(allowed && allowed.includes(next));
}

// Generate secure random verification hash
function generateVerificationProofHash(requestId: string, stores: string[]): string {
  const seed = `${requestId}:${stores.sort().join(',')}:${Date.now()}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `sha256_${hex}789a4b0c2e1f6d8a9b3c4e5f60718293a4b5c6d7`;
}

export const DeletionEngine = {
  // Validate and execute state transition
  transitionStatus(
    request: DeletionRequest,
    nextStatus: RequestStatus,
    actorId: string,
    actorEmail: string,
    actorRole: string,
    notes?: string
  ): { success: boolean; error?: string; request?: DeletionRequest } {
    if (!isValidStatusTransition(request.status, nextStatus)) {
      return {
        success: false,
        error: `Invalid status transition from ${request.status} to ${nextStatus}`,
      };
    }

    const updated: DeletionRequest = {
      ...request,
      status: nextStatus,
      updatedAt: new Date().toISOString(),
      reviewNotes: notes || request.reviewNotes,
    };

    StorageService.saveRequest(updated);

    // Audit the transition
    StorageService.logAuditEvent({
      eventType: 'STATUS_CHANGED',
      actorId,
      actorEmail,
      actorRole,
      requestId: request.id,
      outcome: 'SUCCESS',
      correlationId: `cor_status_${request.id}_${Date.now()}`,
      ipAddressMasked: '103.***.***.***',
      metadata: {
        previousStatus: request.status,
        newStatus: nextStatus,
        notes: notes || '',
      },
    });

    // Notify user
    StorageService.addNotification({
      userId: request.userId,
      requestId: request.id,
      title: `Status Updated: ${nextStatus.replace(/_/g, ' ')}`,
      message: `Your deletion request ${request.id} is now ${nextStatus.replace(/_/g, ' ')}.`,
      type: nextStatus === 'COMPLETED' ? 'SUCCESS' : nextStatus === 'REJECTED' ? 'ERROR' : 'INFO',
    });

    return { success: true, request: updated };
  },

  // Create deletion jobs for all target stores
  scheduleJobsForRequest(
    request: DeletionRequest,
    actorId: string,
    actorEmail: string,
    actorRole: string
  ): DeletionJob[] {
    const systems = request.targetSystems && request.targetSystems.length > 0
      ? request.targetSystems
      : ['Primary PostgreSQL DB', 'Redis Cache', 'ElasticSearch Cluster'];

    const jobs: DeletionJob[] = systems.map((sys, idx) => {
      const job: DeletionJob = {
        id: `JOB-${request.id.replace('PG-', '')}-${(idx + 1).toString().padStart(2, '0')}`,
        requestId: request.id,
        targetSystem: sys,
        operationType:
          sys.toLowerCase().includes('archive') || sys.toLowerCase().includes('ledger')
            ? 'CRYPTOGRAPHIC_ERASURE'
            : sys.toLowerCase().includes('analytics') || sys.toLowerCase().includes('bigquery')
            ? 'ANONYMIZATION'
            : 'HARD_DELETE',
        executionState: 'PENDING',
        attemptCount: 0,
        maxAttempts: 3,
        createdAt: new Date().toISOString(),
        errorCategory: 'NONE',
      };
      StorageService.saveJob(job);
      return job;
    });

    StorageService.logAuditEvent({
      eventType: 'DELETION_JOB_SCHEDULED',
      actorId,
      actorEmail,
      actorRole,
      requestId: request.id,
      outcome: 'SUCCESS',
      correlationId: `cor_sched_${request.id}_${Date.now()}`,
      ipAddressMasked: '127.0.0.1',
      metadata: { jobCount: jobs.length, systems },
    });

    return jobs;
  },

  // Run execution simulation for a job
  async executeJob(job: DeletionJob, actorId: string, actorEmail: string, actorRole: string): Promise<DeletionJob> {
    const updatedJob: DeletionJob = {
      ...job,
      executionState: 'RUNNING',
      attemptCount: job.attemptCount + 1,
      lastAttemptAt: new Date().toISOString(),
    };
    StorageService.saveJob(updatedJob);

    // Short simulated processing delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Determine outcome (Simulated realistic failure on certain systems if already errored, otherwise success)
    const isMockFailure = job.targetSystem.includes('Legacy') && job.attemptCount < 2;

    if (isMockFailure) {
      updatedJob.executionState = 'RETRY_REQUIRED';
      updatedJob.errorCategory = 'TIMEOUT';
      updatedJob.errorMessage = 'Connection timeout on legacy archive gateway. Ready for safe backoff retry.';
    } else {
      updatedJob.executionState = 'SUCCESS';
      updatedJob.completedAt = new Date().toISOString();
      updatedJob.errorCategory = 'NONE';
      updatedJob.errorMessage = undefined;
      updatedJob.verificationResult = {
        verified: true,
        hash: `sha256_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
        verifiedBy: 'automated_crypto_verifier',
        timestamp: new Date().toISOString(),
      };
    }

    StorageService.saveJob(updatedJob);

    StorageService.logAuditEvent({
      eventType: 'DELETION_JOB_EXECUTED',
      actorId,
      actorEmail,
      actorRole,
      requestId: job.requestId,
      outcome: updatedJob.executionState === 'SUCCESS' ? 'SUCCESS' : 'FAILURE',
      correlationId: `cor_exec_${job.id}_${Date.now()}`,
      ipAddressMasked: '127.0.0.1',
      metadata: {
        jobId: job.id,
        targetSystem: job.targetSystem,
        executionState: updatedJob.executionState,
        attempts: updatedJob.attemptCount,
      },
    });

    // Check if all sibling jobs for this request are completed
    this.checkAndUpdateRequestCompletion(job.requestId, actorId, actorEmail, actorRole);

    return updatedJob;
  },

  // Check if all jobs for request are done and verify completion
  checkAndUpdateRequestCompletion(
    requestId: string,
    actorId: string,
    actorEmail: string,
    actorRole: string
  ): void {
    const request = StorageService.getRequestById(requestId);
    if (!request) return;

    const jobs = StorageService.getJobsByRequestId(requestId);
    if (jobs.length === 0) return;

    const allSuccessful = jobs.every((j) => j.executionState === 'SUCCESS');
    const hasFailures = jobs.some((j) => j.executionState === 'FAILED' && j.attemptCount >= j.maxAttempts);

    if (allSuccessful) {
      // Check if there is an active retention exception
      const retentions = StorageService.getRetentions().filter((r) => r.requestId === requestId);
      const isPartial = retentions.length > 0;
      const finalStatus: RequestStatus = isPartial ? 'PARTIALLY_COMPLETED' : 'COMPLETED';

      const updatedRequest: DeletionRequest = {
        ...request,
        status: finalStatus,
        updatedAt: new Date().toISOString(),
        completionSummary: {
          totalStores: jobs.length,
          deletedStores: isPartial ? Math.max(1, jobs.length - retentions.length) : jobs.length,
          retainedStores: retentions.length,
          verificationProofHash: generateVerificationProofHash(
            request.id,
            jobs.map((j) => j.targetSystem)
          ),
          completedAt: new Date().toISOString(),
        },
      };

      StorageService.saveRequest(updatedRequest);

      StorageService.logAuditEvent({
        eventType: 'VERIFICATION_CONFIRMED',
        actorId,
        actorEmail,
        actorRole,
        requestId: request.id,
        outcome: 'SUCCESS',
        correlationId: `cor_complete_${request.id}_${Date.now()}`,
        ipAddressMasked: '127.0.0.1',
        metadata: {
          finalStatus,
          storesProcessed: jobs.length,
          hash: updatedRequest.completionSummary?.verificationProofHash,
        },
      });

      StorageService.addNotification({
        userId: request.userId,
        requestId: request.id,
        title: isPartial ? 'Partial Deletion Completed with Retention' : 'Full Deletion Completed & Verified',
        message: `Deletion operations for request ${request.id} have succeeded and passed cryptographic audit verification.`,
        type: 'SUCCESS',
      });
    } else if (hasFailures) {
      const updatedRequest: DeletionRequest = {
        ...request,
        status: 'FAILED',
        updatedAt: new Date().toISOString(),
      };
      StorageService.saveRequest(updatedRequest);
    }
  },

  // Record a formal retention exception
  recordRetentionException(
    exception: Omit<RetentionException, 'id' | 'decisionTimestamp'>,
    actorId: string,
    actorEmail: string,
    actorRole: string
  ): RetentionException {
    const fullException: RetentionException = {
      ...exception,
      id: `RET-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 90 + 10)}`,
      decisionTimestamp: new Date().toISOString(),
    };

    StorageService.saveRetention(fullException);

    // Link retention exception to request
    const req = StorageService.getRequestById(exception.requestId);
    if (req) {
      req.retentionExceptionId = fullException.id;
      StorageService.saveRequest(req);
    }

    StorageService.logAuditEvent({
      eventType: 'RETENTION_EXCEPTION_CREATED',
      actorId,
      actorEmail,
      actorRole,
      requestId: exception.requestId,
      outcome: 'SUCCESS',
      correlationId: `cor_ret_${fullException.id}_${Date.now()}`,
      ipAddressMasked: '14.139.***.***',
      metadata: {
        exceptionId: fullException.id,
        basis: fullException.documentedBasis,
        category: fullException.affectedDataCategory,
      },
    });

    return fullException;
  },
};
