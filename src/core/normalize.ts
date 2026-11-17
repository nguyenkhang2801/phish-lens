const CONFUSABLES: Record<string, string> = {
  '\u0430': 'a',
  '\u0435': 'e',
  '\u043e': 'o',
  '\u0440': 'p',
  '\u0441': 'c',
  '\u0445': 'x',
  '\u0443': 'y',
  '\u0456': 'i',
  '\u03b1': 'a',
  '\u03bf': 'o',
  '\u0251': 'a',
  '\uff41': 'a',
  '\uff42': 'b',
  '\uff43': 'c',
  '\uff44': 'd',
  '\uff45': 'e',
  '\uff46': 'f',
  '\uff47': 'g',
  '\uff48': 'h',
  '\uff49': 'i',
  '\uff4a': 'j',
  '\uff4b': 'k',
  '\uff4c': 'l',
  '\uff4d': 'm',
  '\uff4e': 'n',
  '\uff4f': 'o',
  '\uff50': 'p',
  '\uff51': 'q',
  '\uff52': 'r',
  '\uff53': 's',
  '\uff54': 't',
  '\uff55': 'u',
  '\uff56': 'v',
  '\uff57': 'w',
  '\uff58': 'x',
  '\uff59': 'y',
  '\uff5a': 'z',
};

export interface NormalizeResult {
  value: string;
  changed: boolean;
}

export function mapConfusables(input: string): NormalizeResult {
  let changed = false;
  let out = '';
  for (const ch of input) {
    const lower = ch.toLowerCase();
    const mapped = CONFUSABLES[lower];
    if (mapped) {
      out += mapped;
      if (mapped !== lower) changed = true;
    } else {
      out += lower;
      if (lower !== ch) changed = true;
    }
  }
  return { value: out, changed };
}

export function substituteLookalikes(input: string): NormalizeResult {
  let out = input.toLowerCase();
  const before = out;
  out = out.replace(/rn/g, 'm');
  out = out.replace(/vv/g, 'w');
  out = out.replace(/0/g, 'o');
  out = out.replace(/1/g, 'l');
  out = out.replace(/5/g, 's');
  return { value: out, changed: out !== before };
}

export function normalizeForBrandMatch(input: string): NormalizeResult {
  const step1 = mapConfusables(input);
  const step2 = substituteLookalikes(step1.value);
  return {
    value: step2.value,
    changed: step1.changed || step2.changed,
  };
}

export function hasNonAsciiLatinMix(domain: string): boolean {
  const hasNonAscii = /\P{ASCII}/u.test(domain);
  if (!hasNonAscii) return false;
  const hasLatin = /[a-zA-Z]/.test(domain);
  return hasLatin;
}

export function hasConfusableChar(domain: string): boolean {
  for (const ch of domain) {
    if (CONFUSABLES[ch.toLowerCase()] !== undefined) return true;
  }
  return /\P{ASCII}/u.test(domain);
}