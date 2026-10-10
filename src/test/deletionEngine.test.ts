import { describe, it, expect, beforeEach } from 'vitest';
import {
  ALLOWED_STATUS_TRANSITIONS,
  isValidStatusTransition,
  DeletionEngine,
} from '@/services/deletionEngine';
import { StorageService } from '@/services/storage';
import { DeletionRequest } from '@/types';

describe('Deterministic State Machine & Deletion Engine', () => {
  beforeEach(() => {
    StorageService.resetToSeeds();
  });

  it('allows valid state progression SUBMITTED -> VERIFICATION_PENDING -> VERIFIED -> UNDER_REVIEW', () => {
    expect(isValidStatusTransition('SUBMITTED', 'VERIFICATION_PENDING')).toBe(true);
    expect(isValidStatusTransition('VERIFICATION_PENDING', 'VERIFIED')).toBe(true);
    expect(isValidStatusTransition('VERIFIED', 'UNDER_REVIEW')).toBe(true);
    expect(isValidStatusTransition('UNDER_REVIEW', 'APPROVED')).toBe(true);
    expect(isValidStatusTransition('APPROVED', 'DELETION_IN_PROGRESS')).toBe(true);
    expect(isValidStatusTransition('DELETION_IN_PROGRESS', 'COMPLETED')).toBe(true);
  });

  it('rejects illegal leapfrogging directly from SUBMITTED to COMPLETED', () => {
    expect(isValidStatusTransition('SUBMITTED', 'COMPLETED')).toBe(false);
  });

  it('rejects illegal leapfrogging from VERIFICATION_PENDING to APPROVED', () => {
    expect(isValidStatusTransition('VERIFICATION_PENDING', 'APPROVED')).toBe(false);
  });

  it('rejects mutation of terminal state COMPLETED', () => {
    expect(isValidStatusTransition('COMPLETED', 'UNDER_REVIEW')).toBe(false);
    expect(isValidStatusTransition('COMPLETED', 'DELETION_IN_PROGRESS')).toBe(false);
  });

  it('schedules deletion jobs across designated target silos', () => {
    const testRequest: DeletionRequest = {
      id: 'PG-TEST-001',
      userId: 'usr_priya_01',
      userEmail: 'priya.sharma@example.com',
      userName: 'Priya Sharma',
      category: 'ACCOUNT_AND_ALL_DATA',
      scopeDetails: 'Testing worker dispatch',
      status: 'APPROVED',
      verificationMethod: 'EMAIL_OTP',
      verificationStatus: 'VERIFIED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      targetSystems: ['Primary PostgreSQL DB', 'Redis Cache', 'ElasticSearch Cluster'],
    };

    const jobs = DeletionEngine.scheduleJobsForRequest(
      testRequest,
      'admin_user',
      'dpo@privacyguard.internal',
      'dpo_admin'
    );

    expect(jobs.length).toBe(3);
    expect(jobs[0].targetSystem).toBe('Primary PostgreSQL DB');
    expect(jobs[0].executionState).toBe('PENDING');
  });

  it('records audit events upon state transitions', () => {
    const initialEventsCount = StorageService.getAuditEvents().length;
    const req = StorageService.getRequestById('PG-2026-9721-M4')!;

    const result = DeletionEngine.transitionStatus(
      req,
      'APPROVED',
      'usr_admin_dpo',
      'dpo.vikram@privacyguard.internal',
      'dpo_admin',
      'Approved during unit test'
    );

    expect(result.success).toBe(true);
    const updatedEvents = StorageService.getAuditEvents();
    expect(updatedEvents.length).toBe(initialEventsCount + 1);
    expect(updatedEvents[0].eventType).toBe('STATUS_CHANGED');
    expect(updatedEvents[0].metadata.newStatus).toBe('APPROVED');
  });
});
