import { formatReason } from '../i18n';
import { hasConfusableChar, mapConfusables } from '../normalize';
import { isOfficialDomainForBrand } from '../brandData';
import type { Signal } from '../types';
import type { RuleContext } from './context';

export function ruleHomoglyph(ctx: RuleContext): Signal | null {
  const { sender, brands, locale } = ctx;
  if (!hasConfusableChar(sender.domain)) return null;

  const mapped = mapConfusables(sender.domainLabel);
  if (!mapped.changed) return null;

  for (const brand of brands) {
    if (mapped.value !== brand.name) continue;
    if (sender.domainLabel === brand.name && !hasConfusableChar(sender.domain)) continue;
    if (isOfficialDomainForBrand(brand.name, sender.registrableDomain)) continue;

    return {
      rule: 'homoglyph',
      score: 90,
      matchedBrand: brand.name,
      reason: formatReason(locale, 'homoglyph', { brand: brand.name }),
    };
  }
  return null;
}