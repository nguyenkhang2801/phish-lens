import { toUnicode as punyToUnicode } from 'node:punycode';

export function domainHasPunycodeLabel(domain: string): boolean {
  return domain.toLowerCase().split('.').some((label) => label.startsWith('xn--'));
}

export function decodeDomainToUnicode(domain: string): string {
  try {
    return domain
      .split('.')
      .map((label) => (label.toLowerCase().startsWith('xn--') ? punyToUnicode(label) : label))
      .join('.');
  } catch {
    return domain;
  }
}