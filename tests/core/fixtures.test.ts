import { describe, expect, it } from 'vitest';
import { analyzeSender } from '../../src/core';
import phishing from '../fixtures/phishing.json';
import legit from '../fixtures/legit.json';

const MEDIUM_PLUS = ['medium', 'high'] as const;

describe('fixture coverage', () => {
  it('has at least 50 phishing and 50 legit samples', () => {
    expect(phishing.length).toBeGreaterThanOrEqual(50);
    expect(legit.length).toBeGreaterThanOrEqual(50);
  });
});

describe('phishing fixtures', () => {
  it.each(phishing)('detects %s at medium or higher', (raw) => {
    const result = analyzeSender(raw, { sensitivity: 'balanced' });
    expect(
      MEDIUM_PLUS,
      `expected medium+ for ${raw}, got ${result.severity} (${result.signals.map((s) => s.rule).join(',')})`,
    ).toContain(result.severity);
  });
});

describe('legit fixtures', () => {
  it.each(legit)('marks %s as safe', (raw) => {
    const result = analyzeSender(raw, { sensitivity: 'balanced' });
    expect(result.severity, `false positive for ${raw}: ${JSON.stringify(result.signals)}`).toBe(
      'safe',
    );
  });
});