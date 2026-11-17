import { parse as parseTld } from 'tldts';
import type { ParsedSender } from './types';

const ANGLE_ADDR = /^(?:"?([^"]*)"?\s*)?<([^<>@\s]+@[^<>@\s]+)>$/;
const EMAIL_ONLY = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseAddress(rawInput: string): ParsedSender | null {
  const raw = rawInput.trim();
  if (!raw) return null;

  let displayName: string | null = null;
  let email = raw;

  const angle = ANGLE_ADDR.exec(raw);
  if (angle) {
    displayName = angle[1]?.trim() || null;
    email = angle[2].trim();
  } else if (!EMAIL_ONLY.test(raw)) {
    return null;
  }

  const at = email.lastIndexOf('@');
  if (at <= 0 || at === email.length - 1) return null;

  const local = email.slice(0, at);
  const domain = email.slice(at + 1).toLowerCase();

  if (!displayName) displayName = null;

  const parsed = parseTld(domain, { allowPrivateDomains: true });
  const registrableDomain =
    parsed.domain?.toLowerCase() ??
    (parsed.hostname?.toLowerCase() || domain);
  const domainLabel =
    parsed.domainWithoutSuffix?.toLowerCase() ??
    registrableDomain.split('.')[0] ??
    '';

  return {
    raw,
    displayName,
    local,
    domain,
    registrableDomain,
    domainLabel,
  };
}