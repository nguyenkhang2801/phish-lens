import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import brands from '../../src/core/data/brands.json';
import freeMail from '../../src/core/data/freeMailDomains.json';

const CORE_DIR = join(process.cwd(), 'src', 'core');
const FORBIDDEN = /fetch\s*\(|XMLHttpRequest|WebSocket|chrome\.|browser\./;

function walkTsFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === 'data') continue;
      out.push(...walkTsFiles(full));
    } else if (entry.endsWith('.ts')) {
      out.push(full);
    }
  }
  return out;
}

describe('core architecture', () => {
  it('does not reference browser or network APIs', () => {
    for (const file of walkTsFiles(CORE_DIR)) {
      const src = readFileSync(file, 'utf8');
      expect(src, file).not.toMatch(FORBIDDEN);
    }
  });

  it('has no domain in both brand official and free-mail lists', () => {
    const official = new Set<string>();
    for (const b of brands) {
      for (const d of b.domains) official.add(d.toLowerCase());
    }
    for (const d of freeMail) {
      expect(official.has(d.toLowerCase()), `overlap: ${d}`).toBe(false);
    }
  });
});