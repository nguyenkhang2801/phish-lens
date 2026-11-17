import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { defineConfig } from 'wxt';
import type { Wxt } from 'wxt';

function registerPublicAssets(wxt: Wxt, files: { absoluteSrc: string; relativeDest: string }[]) {
  const publicRoot = join(wxt.config.root, 'public');
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        walk(full);
        continue;
      }
      const rel = relative(publicRoot, full).replace(/\\/g, '/');
      files.push({ absoluteSrc: full, relativeDest: rel });
    }
  };
  try {
    walk(publicRoot);
  } catch {
    /* public/ missing */
  }
}

export default defineConfig({
  srcDir: 'src',
  publicDir: 'public',
  /** Không tự mở Chrome dev — Google thường chặn đăng nhập trên profile đó. */
  runner: { disabled: true },
  modules: ['@wxt-dev/module-react'],
  vite: () => ({
    resolve: {
      alias: {
        'node:punycode': 'punycode/',
      },
    },
  }),
  manifest: {
    name: 'Phish Lens',
    description:
      'Phát hiện địa chỉ người gửi email giả mạo thương hiệu trên Gmail. Mọi phân tích chạy cục bộ trên máy bạn.',
    permissions: ['storage'],
    icons: {
      16: '/icon/16.png',
      32: '/icon/32.png',
      48: '/icon/48.png',
      128: '/icon/128.png',
    },
    default_locale: 'vi',
  },
  hooks: {
    'build:publicAssets': (wxt, files) => {
      const collected: { absoluteSrc: string; relativeDest: string }[] = [];
      registerPublicAssets(wxt, collected);
      for (const file of collected) {
        files.push(file);
      }
    },
  },
});