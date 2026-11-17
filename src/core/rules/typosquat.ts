import { formatReason } from '../i18n';
import { damerauLevenshtein } from '../damerau';
import { isOfficialDomainForBrand } from '../brandData';
import { normalizeForBrandMatch } from '../normalize';
import type { Signal } from '../types';
import type { RuleContext } from './context';

export function ruleTyposquat(ctx: RuleContext): Signal | null {
  const { sender, brands, locale } = ctx;
  const label = normalizeForBrandMatch(sender.domainLabel).value;
  if (label.length < 5) return null;

  for (const brand of brands) {
    if (isOfficialDomainForBrand(brand.name, sender.registrableDomain)) continue;
    if (label === brand.name) {
      return {
        rule: 'brandSquat',
        score: 90,
        matchedBrand: brand.name,
        reason: formatReason(locale, 'brandSquat', { brand: brand.name }),
      };
    }

    const dist = damerauLevenshtein(label, brand.name);
    if (dist === 1 && label.length >= 5) {
      return {
        rule: 'typosquat',
        score: 85,
        matchedBrand: brand.name,
        reason: formatReason(locale, 'typosquat1', { brand: brand.name }),
      };
    }
    if (dist === 2 && label.length >= 7 && brand.name.length >= 7) {
      return {
        rule: 'typosquat',
        score: 65,
        matchedBrand: brand.name,
        reason: formatReason(locale, 'typosquat2', { brand: brand.name }),
      };
    }
  }
  return null;
}