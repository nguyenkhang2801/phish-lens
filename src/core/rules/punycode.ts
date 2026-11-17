import { formatReason } from '../i18n';
import { isOfficialDomainForBrand } from '../brandData';
import { mapConfusables } from '../normalize';
import { decodeDomainToUnicode, domainHasPunycodeLabel } from '../punycode';
import { parse as parseTld } from 'tldts';
import type { Signal } from '../types';
import type { RuleContext } from './context';

export function rulePunycode(ctx: RuleContext): Signal | null {
  const { sender, brands, locale } = ctx;
  if (!domainHasPunycodeLabel(sender.domain)) return null;

  const decoded = decodeDomainToUnicode(sender.domain);
  const parsed = parseTld(decoded, { allowPrivateDomains: true });
  const label = (parsed.domainWithoutSuffix ?? decoded.split('.')[0]).toLowerCase();
  const mapped = mapConfusables(label);

  for (const brand of brands) {
    if (mapped.value !== brand.name) continue;
    if (isOfficialDomainForBrand(brand.name, sender.registrableDomain)) continue;

    return {
      rule: 'punycode',
      score: 92,
      matchedBrand: brand.name,
      reason: formatReason(locale, 'punycode', { brand: brand.name }),
    };
  }
  return null;
}