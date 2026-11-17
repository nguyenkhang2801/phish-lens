import { describe, expect, it } from 'vitest';
import { decodeDomainToUnicode, domainHasPunycodeLabel } from '../../src/core/punycode';
import { analyzeSender } from '../../src/core';

describe('punycode', () => {
  it('detects xn-- labels', () => {
    expect(domainHasPunycodeLabel('help@xn--mazon-3ve.com'.split('@')[1]!)).toBe(true);
  });

  it('decodes punycode amazon lookalike', () => {
    const decoded = decodeDomainToUnicode('xn--mazon-3ve.com');
    expect(decoded.toLowerCase()).toContain('mazon');
  });

  it('flags punycode phishing sample', () => {
    const r = analyzeSender('help@xn--mazon-3ve.com');
    expect(['medium', 'high']).toContain(r.severity);
  });
});