import { describe, it, expect } from 'vitest';
import { sanitizeCsvField, generateCsv } from '@/services/exportService';

describe('CSV Formula Injection Defense (CWE-1236)', () => {
  it('neutralizes fields starting with equals sign (=)', () => {
    const malicious = '=CMD|"/C calc"!A0';
    const sanitized = sanitizeCsvField(malicious);
    expect(sanitized).toBe('"\'=CMD|""/C calc""!A0"');
  });

  it('neutralizes fields starting with plus (+)', () => {
    const malicious = '+1+2+cmd|"/c calc"!A1';
    const sanitized = sanitizeCsvField(malicious);
    expect(sanitized.startsWith("\"'+")).toBe(true);
  });

  it('neutralizes fields starting with minus (-)', () => {
    const malicious = '-2+3+cmd|"/c calc"!A1';
    const sanitized = sanitizeCsvField(malicious);
    expect(sanitized.startsWith("\"'-")).toBe(true);
  });

  it('neutralizes fields starting with at symbol (@)', () => {
    const malicious = '@SUM(1+1)*cmd|"/c calc"!A1';
    const sanitized = sanitizeCsvField(malicious);
    expect(sanitized.startsWith("\"'@")).toBe(true);
  });

  it('leaves standard benign strings safe without prepending apostrophe', () => {
    const safe = 'PG-2026-8942-X7';
    const sanitized = sanitizeCsvField(safe);
    expect(sanitized).toBe('"PG-2026-8942-X7"');
  });

  it('generates fully escaped CSV row streams', () => {
    const headers = ['ID', 'Scope', 'FormulaTest'];
    const rows = [
      ['PG-01', 'Standard profile', '=HYPERLINK("http://attacker.com","click")'],
    ];
    const csv = generateCsv(headers, rows);
    expect(csv).toContain("\"'=HYPERLINK");
    expect(csv).toContain('"ID","Scope","FormulaTest"');
  });
});
