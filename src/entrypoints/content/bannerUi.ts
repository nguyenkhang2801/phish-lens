import type { Locale, Severity } from '../../core/types';

type SeverityTitles = Record<Exclude<Severity, 'safe'>, string>;

export const BANNER_UI: Record<
  Locale,
  { title: SeverityTitles; trust: string; dismiss: string }
> = {
  vi: {
    title: {
      low: 'Cảnh báo nhẹ – kiểm tra người gửi',
      medium: 'Có dấu hiệu giả mạo người gửi',
      high: 'Nguy cơ cao – có thể là email lừa đảo',
    },
    trust: 'Tin tưởng người gửi này',
    dismiss: 'Ẩn',
  },
  en: {
    title: {
      low: 'Low concern – verify the sender',
      medium: 'Possible sender impersonation',
      high: 'High risk – possible phishing',
    },
    trust: 'Trust this sender',
    dismiss: 'Dismiss',
  },
};