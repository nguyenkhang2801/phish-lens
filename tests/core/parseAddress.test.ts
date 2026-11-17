import { describe, expect, it } from 'vitest';
import { parseAddress } from '../../src/core/parseAddress';

describe('parseAddress', () => {
  it('parses plain email', () => {
    const p = parseAddress('user@Example.COM');
    expect(p?.local).toBe('user');
    expect(p?.domain).toBe('example.com');
    expect(p?.displayName).toBeNull();
  });

  it('parses angle address with display name', () => {
    const p = parseAddress('Alice <alice@mail.test>');
    expect(p?.displayName).toBe('Alice');
    expect(p?.local).toBe('alice');
  });

  it('parses quoted display name', () => {
    const p = parseAddress('"Bob Smith" <bob@mail.test>');
    expect(p?.displayName).toBe('Bob Smith');
  });

  it('returns null for invalid input', () => {
    expect(parseAddress('not-an-email')).toBeNull();
  });
});