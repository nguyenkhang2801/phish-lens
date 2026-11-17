import { cpSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');
const outDir = join(root, '.output', 'chrome-mv3');

if (!existsSync(outDir)) {
  console.warn('copy-public: output missing, skip');
  process.exit(0);
}

cpSync(publicDir, outDir, { recursive: true });
console.log('Copied public/ to .output/chrome-mv3/');