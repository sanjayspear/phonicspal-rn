// Real content ported from v1's js/topics.js — not invented. Only the
// 'cards'-view topics are ported so far (Short Vowels, Long Vowels,
// Consonant Sounds): the simplest view type, good for proving the
// data -> screen pattern. The other ~59 topics (words/family/boxes/
// sentences/… views) are future work — see docs/DESIGN.md §5.3.
//
// Audio (k/fb fields in v1's `it()`) is deliberately left out here: v1
// plays pre-rendered mp3s per sound (assets/audio/s_<id>.mp3) with a
// browser-voice fallback, neither of which exists in this app yet (see
// docs/DESIGN.md §3.3). These screens are visual-only until that's wired.

import type { PhonicsTopic } from './types';

export const phonicsTopics: PhonicsTopic[] = [
  {
    id: 'short',
    name: 'Short Vowels',
    icon: '🍎',
    intro:
      'The five short vowel sounds: a in cat, e in bed, i in sit, o in hot, u in sun. Tap a card to see the sound and its words.',
    tip: 'Tap a card and say the sound with me!',
    cards: [
      { symbol: 'a', exampleWords: ['apple', 'cat', 'map', 'bag'], tag: 'short', hint: 'Short a says /ă/.' },
      { symbol: 'e', exampleWords: ['egg', 'bed', 'hen', 'red'], tag: 'short', hint: 'Short e says /ĕ/.' },
      { symbol: 'i', exampleWords: ['igloo', 'sit', 'pin', 'fish'], tag: 'short', hint: 'Short i says /ĭ/.' },
      { symbol: 'o', exampleWords: ['octopus', 'hot', 'dog', 'fox'], tag: 'short', hint: 'Short o says /ŏ/.' },
      { symbol: 'u', exampleWords: ['umbrella', 'sun', 'cup', 'bus'], tag: 'short', hint: 'Short u says /ŭ/.' },
    ],
  },
  {
    id: 'long',
    name: 'Long Vowels',
    icon: '🦄',
    intro: 'Long vowels say their own name: a in cake, e in tree, i in kite, o in boat, u in cube.',
    tip: 'Long vowels say their name!',
    cards: [
      { symbol: 'ā', exampleWords: ['cake', 'rain', 'baby', 'game'], tag: 'long' },
      { symbol: 'ē', exampleWords: ['tree', 'me', 'feet', 'equal'], tag: 'long' },
      { symbol: 'ī', exampleWords: ['kite', 'night', 'ice', 'light'], tag: 'long' },
      { symbol: 'ō', exampleWords: ['boat', 'rope', 'note', 'go'], tag: 'long' },
      { symbol: 'ū', exampleWords: ['unicorn', 'cute', 'music', 'cube'], tag: 'long' },
    ],
  },
  {
    id: 'cons',
    name: 'Consonant Sounds',
    icon: '🐝',
    intro: 'Tap a card to see the sound and an example word.',
    tip: 'Every letter has its own sound. Let’s listen!',
    cards: [
      { symbol: 'b', exampleWords: ['ball'] },
      {
        symbol: 'c',
        exampleWords: ['cat'],
        hint: 'Hard c says k. Before e, i or y it usually says s, as in city.',
      },
      { symbol: 'd', exampleWords: ['dog'] },
      { symbol: 'f', exampleWords: ['fish'] },
      { symbol: 'g', exampleWords: ['goat'], hint: 'Hard g as in goat. Before e, i or y it can say j, as in gem.' },
      { symbol: 'h', exampleWords: ['hat'] },
      { symbol: 'j', exampleWords: ['jam'] },
      { symbol: 'k', exampleWords: ['kite'] },
      { symbol: 'l', exampleWords: ['lion'] },
      { symbol: 'm', exampleWords: ['moon'] },
      { symbol: 'n', exampleWords: ['nest'] },
      { symbol: 'p', exampleWords: ['pig'] },
      { symbol: 'q', exampleWords: ['queen'] },
      { symbol: 'r', exampleWords: ['rabbit'] },
      { symbol: 's', exampleWords: ['sun'] },
      { symbol: 't', exampleWords: ['tent'] },
      { symbol: 'v', exampleWords: ['van'] },
      { symbol: 'w', exampleWords: ['web'] },
      { symbol: 'x', exampleWords: ['box'], hint: 'x says ks, as at the end of box.' },
      { symbol: 'y', exampleWords: ['yak'] },
      { symbol: 'z', exampleWords: ['zebra'] },
    ],
  },
];

export function getPhonicsTopic(id: string): PhonicsTopic | undefined {
  return phonicsTopics.find((t) => t.id === id);
}
