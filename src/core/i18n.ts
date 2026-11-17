import type { Locale } from './types';

type TemplateKey =
  | 'homoglyph'
  | 'punycode'
  | 'charNormalize'
  | 'typosquat1'
  | 'typosquat2'
  | 'brandSquat'
  | 'freeMailBrand'
  | 'displayNameMismatch';

const TEMPLATES: Record<Locale, Record<TemplateKey, string>> = {
  vi: {
    homoglyph:
      'Tên miền dùng ký tự dễ nhầm với chữ Latin, trông giống thương hiệu $brand',
    punycode: 'Tên miền Punycode (xn--) có thể che ký tự Unicode giả mạo $brand',
    charNormalize:
      'Tên miền hoặc địa chỉ dùng chữ thay thế (rn, số 0/1…) giống thương hiệu $brand',
    typosquat1: 'Tên miền gần giống (lỗi 1 ký tự) thương hiệu $brand',
    typosquat2: 'Tên miền gần giống (lỗi 2 ký tự) thương hiệu $brand',
    brandSquat: 'Tên miền chứa tên $brand nhưng không phải domain chính thức',
    freeMailBrand: 'Email miễn phí ($domain) giả mạo đại diện $brand',
    displayNameMismatch: 'Tên hiển thị giống $brand nhưng domain không thuộc thương hiệu',
  },
  en: {
    homoglyph:
      'Domain uses confusable characters resembling brand $brand',
    punycode: 'Punycode domain (xn--) may hide spoofed Unicode for $brand',
    charNormalize:
      'Address uses lookalike substitutions (rn, 0/1…) matching $brand',
    typosquat1: 'Domain is one character away from brand $brand',
    typosquat2: 'Domain is two characters away from brand $brand',
    brandSquat: 'Domain name matches $brand but is not an official domain',
    freeMailBrand: 'Free-mail host ($domain) impersonating $brand',
    displayNameMismatch: 'Display name suggests $brand but domain is not official',
  },
};

export function formatReason(
  locale: Locale,
  key: TemplateKey,
  vars: Record<string, string>,
): string {
  let text = TEMPLATES[locale][key];
  for (const [k, v] of Object.entries(vars)) {
    text = text.replace(`$${k}`, v);
  }
  return text;
}