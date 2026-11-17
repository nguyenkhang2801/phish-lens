import { formatReason } from '../i18n';
import { isOfficialDomainForBrand } from '../brandData';
import { normalizeForBrandMatch } from '../normalize';
import type { Signal } from '../types';
import type { RuleContext } from './context';

function checkPart(ctx: RuleContext, original: string): Signal | null {
  const { brands, locale, sender } = ctx;
  const normalized = normalizeForBrandMatch(original);
  if (!normalized.changed) return null;

  for (const brand of brands) {
    if (normalized.value !== brand.name) continue;
    if (isOfficialDomainForBrand(brand.name, sender.registrableDomain)) continue;

    return {
      rule: 'charNormalize',
      score: 88,
      matchedBrand: brand.name,
      reason: formatReason(locale, 'charNormalize', { brand: brand.name }),
    };
  }
  return null;
}

export function ruleCharNormalize(ctx: RuleContext): Signal | null {
  return (
    checkPart(ctx, ctx.sender.domainLabel) ??
    checkPart(ctx, ctx.sender.local.split('+')[0].split('.')[0])
  );
}