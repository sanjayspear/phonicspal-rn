// Ported verbatim from v1's js/curriculum.js — digraph/r-controlled/
// diphthong datasets used by the 'dg', 'rc' and 'dp' topics.

import { LETTER_SOUNDS } from './letterSounds';
import type { PhonicsCard } from './types';

export const digraphs: PhonicsCard[] = [
  { symbol: 'ch', exampleWords: ['chip', 'chin', 'chop', 'lunch'], hint: 'Two letters, one sound: like a train, ch-ch-ch.' },
  { symbol: 'sh', exampleWords: ['ship', 'shop', 'fish', 'wish'], hint: 'Quiet sound: shhh.' },
  { symbol: 'th', exampleWords: ['thin', 'thumb', 'bath', 'this'], hint: 'Put your tongue between your teeth. Voiced in "this".' },
  { symbol: 'wh', exampleWords: ['whale', 'wheel', 'white', 'when'], hint: 'Sounds like w. Used in question words.' },
  // ck says /k/, not its own sound — reuses the same target phoneme as
  // the letter k (see letterSounds.ts), not a separate respelling.
  { symbol: 'ck', exampleWords: ['duck', 'clock', 'sock', 'back'], hint: 'Comes at the end of a short-vowel word: k.', sound: LETTER_SOUNDS.k },
];

export const rControlled: PhonicsCard[] = [
  { symbol: 'ar', exampleWords: ['car', 'star', 'farm', 'park'], hint: 'Bossy R: "ar" says ar, like a pirate.' },
  { symbol: 'er', exampleWords: ['her', 'fern', 'teacher', 'sister'], hint: 'Bossy R: "er" says er.' },
  { symbol: 'ir', exampleWords: ['bird', 'girl', 'shirt', 'stir'], hint: 'Bossy R: "ir" says er too.', sound: 'er' },
  { symbol: 'or', exampleWords: ['corn', 'fork', 'horse', 'storm'], hint: 'Bossy R: "or" says or.' },
  { symbol: 'ur', exampleWords: ['turn', 'burn', 'nurse', 'purple'], hint: 'Bossy R: "ur" says er as well.', sound: 'er' },
];

export const diphthongs: PhonicsCard[] = [
  { symbol: 'oi', exampleWords: ['coin', 'oil', 'soil', 'boil'], hint: 'Two vowel sounds glide together: oi.' },
  { symbol: 'oy', exampleWords: ['boy', 'toy', 'joy', 'enjoy'], hint: 'Same sound as oi, used at the end of words.' },
  { symbol: 'ou', exampleWords: ['cloud', 'house', 'mouse', 'out'], hint: 'Say ow, like when something hurts.' },
  { symbol: 'ow', exampleWords: ['cow', 'now', 'down', 'brown'], hint: 'Same sound as ou, used at the end of words.' },
];
