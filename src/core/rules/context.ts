import type { Brand, Locale, ParsedSender } from '../types';

export interface RuleContext {
  sender: ParsedSender;
  brands: Brand[];
  freeMail: Set<string>;
  locale: Locale;
}

export const ROLE_TOKENS = new Set([
  'support',
  'help',
  'security',
  'billing',
  'noreply',
  'admin',
  'service',
  'info',
  'team',
  'alert',
  'verify',
  'account',
  'update',
]);