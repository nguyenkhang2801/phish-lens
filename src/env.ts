/** Chỉ true khi chạy bản do `pnpm dev` build (không có trong production zip). */
export function isExtensionDev(): boolean {
  return import.meta.env.DEV;
}