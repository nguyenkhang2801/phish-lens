import type { AnalysisResult, Locale } from '../core/types';

/** Chỉ dùng khi demoInvertSeverity — không đổi logic core. */
export function buildDemoBannerResult(base: AnalysisResult, locale: Locale): AnalysisResult {
  const reason =
    locale === 'vi'
      ? '[CHẾ ĐỘ THỬ] Mail này được engine coi là an toàn; banner chỉ để kiểm tra giao diện. Tắt trong popup khi xong.'
      : '[DEMO] Engine marked this sender safe; banner is for UI testing only. Disable in the popup when done.';

  return {
    ...base,
    score: 70,
    severity: 'medium',
    signals: [{ rule: 'demo', score: 70, reason }],
  };
}