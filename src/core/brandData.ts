import type { Brand } from './types';
import brandsJson from './data/brands.json';
import freeMailJson from './data/freeMailDomains.json';

export const BRANDS: Brand[] = brandsJson as Brand[];
export const FREE_MAIL_DOMAINS: Set<string> = new Set(
  (freeMailJson as string[]).map((d) => d.toLowerCase()),
);

const OFFICIAL = new Map<string, Set<string>>();

for (const brand of BRANDS) {
  OFFICIAL.set(brand.name.toLowerCase(), new Set(brand.domains.map((d) => d.toLowerCase())));
}

export function isOfficialDomainForBrand(brandName: string, registrableDomain: string): boolean {
  const set = OFFICIAL.get(brandName.toLowerCase());
  return set?.has(registrableDomain.toLowerCase()) ?? false;
}

export function isOfficialDomain(registrableDomain: string): boolean {
  const lower = registrableDomain.toLowerCase();
  for (const set of OFFICIAL.values()) {
    if (set.has(lower)) return true;
  }
  return false;
}