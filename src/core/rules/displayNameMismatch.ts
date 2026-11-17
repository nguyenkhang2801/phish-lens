import { formatReason } from '../i18n';
import { isOfficialDomainForBrand } from '../brandData';
import { normalizeForBrandMatch } from '../normalize';
import type { Signal } from '../types';
import type { RuleContext } from './context';

function containsWholeWord(haystack: string, word: string): boolean {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(?:^|[\\s"'(@])${escaped}(?:$|[\\s"'.,)@])`, 'i');
  return re.test(haystack);
}

export function ruleDisplayNameMismatch(ctx: RuleContext): Signal | null {
  const { sender, brands, locale } = ctx;
  const name = sender.displayName;
  if (!name) return null;

  const normalizedName = normalizeForBrandMatch(name).value;

  for (const brand of brands) {
    if (!containsWholeWord(normalizedName, brand.name)) continue;
    if (isOfficialDomainForBrand(brand.name, sender.registrableDomain)) continue;

    return {
      rule: 'displayNameMismatch',
      score: 80,
      matchedBrand: brand.name,
      reason: formatReason(locale, 'displayNameMismatch', { brand: brand.name }),
    };
  }
  return null;
}