import { formatReason } from '../i18n';
import { normalizeForBrandMatch } from '../normalize';
import type { Signal } from '../types';
import type { RuleContext } from './context';
import { ROLE_TOKENS } from './context';

function localMatchesBrand(local: string, brandName: string): boolean {
  const norm = normalizeForBrandMatch(local).value;
  if (norm === brandName) return true;
  const parts = norm.split(/[._-]+/);
  if (parts.length === 2 && parts[0] === brandName && ROLE_TOKENS.has(parts[1])) return true;
  if (parts.length === 2 && parts[1] === brandName && ROLE_TOKENS.has(parts[0])) return true;
  const dotBrand = `${brandName}.`;
  if (norm.startsWith(dotBrand)) {
    const role = norm.slice(brandName.length + 1).split('.')[0];
    if (ROLE_TOKENS.has(role)) return true;
  }
  return false;
}

export function ruleFreeMailBrand(ctx: RuleContext): Signal | null {
  const { sender, brands, freeMail, locale } = ctx;
  if (!freeMail.has(sender.registrableDomain)) return null;

  const localBase = sender.local.split('+')[0];

  for (const brand of brands) {
    if (!localMatchesBrand(localBase, brand.name)) continue;

    return {
      rule: 'freeMailBrand',
      score: 85,
      matchedBrand: brand.name,
      reason: formatReason(locale, 'freeMailBrand', {
        brand: brand.name,
        domain: sender.registrableDomain,
      }),
    };
  }
  return null;
}