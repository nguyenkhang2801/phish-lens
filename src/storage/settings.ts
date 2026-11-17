import { parse as parseTld } from 'tldts';
import { isExtensionDev } from '../env';
import type { Locale, Sensitivity } from '../core/types';

export interface Settings {
  enabled: boolean;
  sensitivity: Sensitivity;
  whitelist: string[];
  locale: Locale;
  /** Đảo logic banner: mail safe → hiện cảnh báo (chỉ để test UI). */
  demoInvertSeverity: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  sensitivity: 'balanced',
  whitelist: [],
  locale: 'vi',
  demoInvertSeverity: false,
};

const STORAGE_KEY = 'phishLensSettings';

function mergeSettings(partial: Partial<Settings> | undefined): Settings {
  const merged: Settings = {
    ...DEFAULT_SETTINGS,
    ...partial,
    whitelist: partial?.whitelist ?? DEFAULT_SETTINGS.whitelist,
  };
  if (!isExtensionDev()) {
    merged.demoInvertSeverity = false;
  }
  return merged;
}

export async function loadSettings(): Promise<Settings> {
  const result = await browser.storage.local.get(STORAGE_KEY);
  const stored = result[STORAGE_KEY] as Partial<Settings> | undefined;
  return mergeSettings(stored);
}

export async function saveSettings(settings: Settings): Promise<void> {
  const toStore: Settings = isExtensionDev()
    ? settings
    : { ...settings, demoInvertSeverity: false };
  await browser.storage.local.set({ [STORAGE_KEY]: toStore });
}

export async function addToWhitelist(registrableDomain: string): Promise<Settings> {
  const current = await loadSettings();
  const domain = registrableDomain.toLowerCase();
  if (current.whitelist.includes(domain)) return current;
  const next = { ...current, whitelist: [...current.whitelist, domain] };
  await saveSettings(next);
  return next;
}

export function normalizeWhitelistDomain(input: string): string {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return '';
  const host = trimmed.includes('@') ? trimmed.split('@').pop()! : trimmed;
  const bare = host.replace(/^https?:\/\//, '').split('/')[0] ?? host;
  const parsed = parseTld(bare, { allowPrivateDomains: true });
  return parsed.domain?.toLowerCase() ?? bare;
}