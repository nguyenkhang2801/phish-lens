export type Severity = 'safe' | 'low' | 'medium' | 'high';

export type Locale = 'vi' | 'en';

export type Sensitivity = 'strict' | 'balanced' | 'relaxed';

export interface Brand {
  name: string;
  domains: string[];
}

export interface ParsedSender {
  raw: string;
  displayName: string | null;
  local: string;
  domain: string;
  registrableDomain: string;
  domainLabel: string;
}

export interface Signal {
  rule: string;
  score: number;
  reason: string;
  matchedBrand?: string;
}

export interface AnalysisResult {
  sender: ParsedSender;
  score: number;
  severity: Severity;
  signals: Signal[];
}

export interface AnalyzeOptions {
  whitelist?: string[];
  locale?: Locale;
  sensitivity?: Sensitivity;
}