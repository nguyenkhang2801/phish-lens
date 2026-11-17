import { BRANDS, FREE_MAIL_DOMAINS, isOfficialDomain } from './brandData';
import { parseAddress } from './parseAddress';
import { aggregateScore, scoreToSeverity } from './scoring';
import type { AnalysisResult, AnalyzeOptions, ParsedSender, Signal } from './types';
import { ruleCharNormalize } from './rules/charNormalize';
import { ruleDisplayNameMismatch } from './rules/displayNameMismatch';
import { ruleFreeMailBrand } from './rules/freeMailBrand';
import { ruleHomoglyph } from './rules/homoglyph';
import { rulePunycode } from './rules/punycode';
import { ruleTyposquat } from './rules/typosquat';
import type { RuleContext } from './rules/context';

const RULES = [
  ruleHomoglyph,
  rulePunycode,
  ruleCharNormalize,
  ruleTyposquat,
  ruleFreeMailBrand,
  ruleDisplayNameMismatch,
];

function emptySender(raw: string): ParsedSender {
  return {
    raw,
    displayName: null,
    local: '',
    domain: '',
    registrableDomain: '',
    domainLabel: '',
  };
}

export function analyzeSender(raw: string, opts?: AnalyzeOptions): AnalysisResult {
  const locale = opts?.locale ?? 'vi';
  const sensitivity = opts?.sensitivity ?? 'balanced';
  const whitelist = new Set((opts?.whitelist ?? []).map((d) => d.toLowerCase()));

  const parsed = parseAddress(raw);
  if (!parsed) {
    return {
      sender: emptySender(raw),
      score: 0,
      severity: 'safe',
      signals: [],
    };
  }

  if (whitelist.has(parsed.registrableDomain)) {
    return { sender: parsed, score: 0, severity: 'safe', signals: [] };
  }

  if (isOfficialDomain(parsed.registrableDomain)) {
    return { sender: parsed, score: 0, severity: 'safe', signals: [] };
  }

  const ctx: RuleContext = {
    sender: parsed,
    brands: BRANDS,
    freeMail: FREE_MAIL_DOMAINS,
    locale,
  };

  const signals: Signal[] = [];
  for (const run of RULES) {
    const signal = run(ctx);
    if (signal) signals.push(signal);
  }

  const score = aggregateScore(signals);
  const severity = scoreToSeverity(score, sensitivity);

  return { sender: parsed, score, severity, signals };
}

export * from './types';
export { parseAddress } from './parseAddress';