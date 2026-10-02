// The single canonical table of phonic sounds (phonemes) per letter — NOT
// alphabet letter names. A letter name is how it's recited alphabetically
// ("A" = /eɪ/ "ay", "B" = /biː/ "bee"); a phonic sound is the phoneme it
// actually makes in a word ("A" = /æ/ as in "ant", "B" = /b/ as in "bat").
// Confusing the two is the exact bug this table exists to prevent — see
// PhonicsCardTile's header in packages/ui for why a plain TTS engine
// defaults to the former when all you give it is a bare letter.
//
// Target phoneme per letter (IPA), for anyone auditing a value below
// against the phonic sound it's supposed to approximate:
//   a /æ/ (ant)     j /dʒ/ (jam)    s /s/ (sun)
//   b /b/ (bat)     k /k/ (kite)    t /t/ (top)
//   c /k/ (cat)     l /l/ (log)     u /ʌ/ (up)
//   d /d/ (dog)     m /m/ (man)     v /v/ (van)
//   e /e/ (egg)     n /n/ (net)     w /w/ (win)
//   f /f/ (fox)     o /ɒ/ (ox)      x /ks/ (box)
//   g /ɡ/ (gas)     p /p/ (pen)     y /j/ (yak)
//   h /h/ (hat)     q /kw/ (queen)  z /z/ (zip)
//   i /ɪ/ (ink)     r /r/ (rat)
//
// Neither expo-speech (native) nor the Web Speech API (web) accept IPA or
// SSML phoneme input — there's no way to hand either engine "/æ/" and get
// that exact phoneme back, only plain text run through the engine's own
// grapheme-to-phoneme rules. Each value below is the closest plain-ASCII
// respelling of its target phoneme that a generic English TTS voice
// reliably renders as a real sound rather than falling back to spelling
// the letter's name out — consonants get a trailing schwa (e.g. "buh" for
// /b/) because a bare consonant with nothing to pronounce it against is
// exactly the ambiguous shape that triggers that fallback; this is an
// approximation of the target phoneme, not a guarantee of it.
export const LETTER_SOUNDS: Record<string, string> = {
  a: 'ah', e: 'eh', i: 'ih', o: 'aw', u: 'uh',
  b: 'buh', c: 'kuh', d: 'duh', f: 'fuh', g: 'guh', h: 'huh', j: 'juh',
  k: 'kuh', l: 'luh', m: 'muh', n: 'nuh', p: 'puh', q: 'kwuh', r: 'ruh',
  s: 'suh', t: 'tuh', v: 'vuh', w: 'wuh', x: 'kuss', y: 'yuh', z: 'zuh',
};
