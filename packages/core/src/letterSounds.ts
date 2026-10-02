// Single-letter phonic sound respellings, TTS-safe the same way
// PhonicsCard['sound'] is (see types.ts) — reused by the 'sounds'-view
// game (apps/app/src/components/phonics-games.tsx) so isolating one sound
// from a word speaks the actual phonic sound, not the letter's alphabet
// name. Values match the short-vowel/consonant cards in topics.ts.
export const LETTER_SOUNDS: Record<string, string> = {
  a: 'ah', e: 'eh', i: 'ih', o: 'aw', u: 'uh',
  b: 'buh', c: 'kuh', d: 'duh', f: 'fuh', g: 'guh', h: 'huh', j: 'juh',
  k: 'kuh', l: 'luh', m: 'muh', n: 'nuh', p: 'puh', q: 'kwuh', r: 'ruh',
  s: 'suh', t: 'tuh', v: 'vuh', w: 'wuh', x: 'kuss', y: 'yuh', z: 'zuh',
};
