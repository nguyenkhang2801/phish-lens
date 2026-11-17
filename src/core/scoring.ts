import type { Sensitivity, Severity, Signal } from './types';

const THRESHOLDS: Record<
  Sensitivity,
  { safeMax: number; lowMax: number; mediumMax: number }
> = {
  strict: { safeMax: 19, lowMax: 44, mediumMax: 69 },
  balanced: { safeMax: 29, lowMax: 59, mediumMax: 79 },
  relaxed: { safeMax: 44, lowMax: 69, mediumMax: 89 },
};

export function aggregateScore(signals: Signal[]): number {
  if (signals.length === 0) return 0;
  const max = Math.max(...signals.map((s) => s.score));
  if (signals.length >= 2) return Math.min(100, max + 10);
  return max;
}

export function scoreToSeverity(score: number, sensitivity: Sensitivity): Severity {
  const t = THRESHOLDS[sensitivity];
  if (score <= t.safeMax) return 'safe';
  if (score <= t.lowMax) return 'low';
  if (score <= t.mediumMax) return 'medium';
  return 'high';
}