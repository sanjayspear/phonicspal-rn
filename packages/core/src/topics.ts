// All 62 topics from v1's js/topics.js, organized under the same 8
// browsing categories v1 uses (its GROUPS). Every topic's real id/name/
// icon/intro/tip is ported — nothing invented. Topics using the 'cards',
// 'groups' or 'words' view types also carry their full interactive data
// and have a real renderer in apps/app's phonics screens; the other 19
// view types (family, boxes, builder, stories, fluency, …) are cataloged
// with real content but rendered as a "coming soon" placeholder until a
// matching view component exists — see types.ts's PhonicsTopic comment.
import { digraphs, diphthongs, rControlled } from './curriculum';
import type { PhonicsCard, PhonicsTopic, TopicCategory } from './types';

const VB: PhonicsCard[] = [
  { symbol: 'ai', exampleWords: ['rain'] },
  { symbol: 'ee', exampleWords: ['bee'] },
  { symbol: 'oa', exampleWords: ['boat'] },
  { symbol: 'oo', exampleWords: ['moon'], hint: 'Also in flute and rule.' },
  { symbol: 'ou', exampleWords: ['cloud'], hint: 'A glide sound: see Diphthongs too.' },
  { symbol: 'ie', exampleWords: ['pie'] },
  { symbol: 'ea', exampleWords: ['leaf'] },
  { symbol: 'ow', exampleWords: ['snow'], hint: 'ow can also say ow, as in cow.' },
];

const CB: PhonicsCard[] = [
  { symbol: 'bl', exampleWords: ['blue'] },
  { symbol: 'br', exampleWords: ['brush'] },
  { symbol: 'cl', exampleWords: ['clap'] },
  { symbol: 'cr', exampleWords: ['crab'] },
  { symbol: 'dr', exampleWords: ['drum'] },
  { symbol: 'fl', exampleWords: ['flag'] },
  { symbol: 'fr', exampleWords: ['frog'] },
  { symbol: 'gl', exampleWords: ['globe'] },
  { symbol: 'gr', exampleWords: ['grape'] },
  { symbol: 'pl', exampleWords: ['plant'] },
  { symbol: 'pr', exampleWords: ['prince'] },
  { symbol: 'sk', exampleWords: ['skate'] },
  { symbol: 'sl', exampleWords: ['sled'] },
  { symbol: 'sm', exampleWords: ['smile'] },
  { symbol: 'sn', exampleWords: ['snake'] },
  { symbol: 'sp', exampleWords: ['spider'] },
  { symbol: 'st', exampleWords: ['star'] },
  { symbol: 'sw', exampleWords: ['swan'] },
  { symbol: 'tr', exampleWords: ['tree'] },
];

const TRIG: PhonicsCard[] = [
  { symbol: 'tch', exampleWords: ['witch', 'watch', 'catch'], hint: 'tch says ch. It comes right after a short vowel.', sound: 'ch' },
  { symbol: 'dge', exampleWords: ['bridge', 'badge', 'hedge'], hint: 'dge says j, right after a short vowel.', sound: 'juh' },
  { symbol: 'igh', exampleWords: ['night', 'light', 'high'], hint: 'Three letters make the long i sound.', sound: 'eye' },
  { symbol: 'air', exampleWords: ['chair', 'hair', 'fair'], hint: 'Three letters, one sound: air.' },
  { symbol: 'ear', exampleWords: ['ear', 'hear', 'beard'], hint: 'ear says ear: I hear with my ear.' },
];

export const phonicsTopics: PhonicsTopic[] = [
  /* ----- Short vowels ----- */
  {
    id: 'short', name: 'Short Vowels', icon: '🍎', view: 'cards',
    intro: 'The five short vowel sounds: a in cat, e in bed, i in sit, o in hot, u in sun. Tap a card to see the sound and its words.',
    tip: 'Tap a card and say the sound with me!',
    cards: [
      { symbol: 'a', exampleWords: ['apple', 'cat', 'map', 'bag'], tag: 'short', hint: 'Short a says /ă/.', sound: 'ah' },
      { symbol: 'e', exampleWords: ['egg', 'bed', 'hen', 'red'], tag: 'short', hint: 'Short e says /ĕ/.', sound: 'eh' },
      { symbol: 'i', exampleWords: ['igloo', 'sit', 'pin', 'fish'], tag: 'short', hint: 'Short i says /ĭ/.', sound: 'ih' },
      { symbol: 'o', exampleWords: ['octopus', 'hot', 'dog', 'fox'], tag: 'short', hint: 'Short o says /ŏ/.', sound: 'aw' },
      { symbol: 'u', exampleWords: ['umbrella', 'sun', 'cup', 'bus'], tag: 'short', hint: 'Short u says /ŭ/.', sound: 'uh' },
    ],
  },
  {
    id: 'cvc', name: 'CVC Words', icon: '🐱', view: 'words',
    intro: 'Consonant, vowel, consonant: three sounds, like c-a-t. Tap Blend to hear each sound join into the word.',
    tip: 'Three sounds make a word: c… a… t… cat!',
    words: ['c-a-t', 'm-a-p', 'b-a-g', 'h-a-t', 'f-a-n', 'c-a-p', 'b-e-d', 'h-e-n', 'n-e-t', 'j-e-t', 'l-e-g', 'p-e-n', 'p-i-g', 'p-i-n', 's-i-x', 'l-i-p', 'z-i-p', 'b-i-n', 'd-o-g', 'f-o-x', 'b-o-x', 'p-o-t', 'm-o-p', 'l-o-g', 's-u-n', 'c-u-p', 'b-u-s', 'b-u-g', 'm-u-g', 'n-u-t'],
  },
  {
    id: 'families', name: 'Word Families', icon: '🏠', view: 'family',
    intro: 'Words in a family share an ending: cat, hat, bat. Change the first letter to make a new word.',
    tip: 'Pick a family, then change the first letter!',
  },
  {
    id: 'pairs', name: 'Minimal Pairs', icon: '👂', view: 'pairs',
    intro: 'Two words that are the same except for one sound, like pin and pen. Listening for the difference sharpens the ear.',
    tip: 'Pin or pen? Listen closely!',
  },
  {
    id: 'svblend', name: 'Short-Vowel Blending', icon: '🔗', view: 'words',
    intro: 'Say each sound, then push them together to read the word. The picture pops up when the word is blended.',
    tip: 'Listen to the sounds, then shout the word!',
    words: ['h-a-t', 'r-a-t', 'v-a-n', 'p-a-n', 'j-a-m', 't-e-n', 'w-e-b', 'd-i-g', 'k-i-d', 'h-o-t', 't-u-b', 'h-u-t'],
  },
  {
    id: 'svseg', name: 'Short-Vowel Segmenting', icon: '✂️', view: 'boxes',
    intro: 'Segmenting is the opposite of blending: break a word into its sounds, one sound per box.',
    tip: 'One sound in each box!',
  },
  {
    id: 'dictation', name: 'Short-Vowel Dictation', icon: '✏️', view: 'dictation',
    intro: 'Listen to a word, say its sounds, then write or build it. Tap a card to hear the word, then check the spelling.',
    tip: 'Listen, then spell it with letters!',
  },
  {
    id: 'svsent', name: 'Decodable Sentences', icon: '📝', view: 'sentences',
    intro: 'Sentences made only from short-vowel words and a few tricky words (the, a, is), so a beginner can read every word.',
    tip: 'Read the sentence. Which picture is it?',
  },
  {
    id: 'svmix', name: 'Mixed Practice', icon: '🎲', view: 'mix',
    intro: 'All five short vowels mixed together. Shuffle for new words, or play the mixed game.',
    tip: 'Shuffle the words and blend them all!',
  },
  {
    id: 'svspell', name: 'Spelling Patterns', icon: '🔍', view: 'groups',
    intro: 'Short vowels come with spelling rules: ck at the end (duck), double f, l, s and z (bell), and the glued sounds ng and nk.',
    tip: 'Short vowel words have spelling tricks!',
    groups: [
      { big: 'ck', title: 'ck at the end', sub: 'After a short vowel, the k sound at the end is spelled ck.', words: ['duck', 'sock', 'kick', 'clock'] },
      { big: 'll', title: 'ff · ll · ss · zz', sub: 'Short vowel then f, l, s or z at the end? Double it!', words: ['bell', 'doll', 'hill', 'kiss', 'dress', 'buzz'] },
      { big: 'ng', title: 'ng', sub: 'n and g glue together to make one sound.', words: ['ring', 'king', 'sing'] },
      { big: 'nk', title: 'nk', sub: 'n and k glue together: nk.', words: ['pink', 'sink', 'skunk'] },
    ],
  },

  /* ----- Phonemic awareness: ears only ----- */
  {
    id: 'listen', name: 'Listening for Sounds', icon: '🎧', view: 'listen',
    intro: 'Before letters, children learn to listen: which animal made that sound, and are two words the same or different?',
    tip: 'Close your eyes and listen!',
  },
  {
    id: 'rhyme', name: 'Rhyming', icon: '🎵', view: 'groups',
    intro: 'Rhyming words sound the same at the end: cat, hat, bat. Tap a family to hear them all.',
    tip: 'Cat, hat, bat… they rhyme!',
    groups: [
      { big: '-at', title: 'cat, hat, bat, rat', words: ['cat', 'hat', 'bat', 'rat'] },
      { big: '-og', title: 'dog, log, frog', words: ['dog', 'log', 'frog'] },
      { big: '-ed', title: 'bed, red, sled', words: ['bed', 'red', 'sled'] },
      { big: '-en', title: 'hen, pen, ten', words: ['hen', 'pen', 'ten'] },
      { big: '-ox', title: 'fox, box', words: ['fox', 'box'] },
      { big: '-ake', title: 'cake, snake', words: ['cake', 'snake'] },
      { big: '-ee', title: 'bee, tree, three, key', words: ['bee', 'tree', 'three', 'key'] },
      { big: '-oon', title: 'moon, spoon', words: ['moon', 'spoon'] },
      { big: '-ar', title: 'star, car, jar', words: ['star', 'car', 'jar'] },
      { big: '-oat', title: 'boat, goat, coat', words: ['boat', 'goat', 'coat'] },
      { big: '-ouse', title: 'mouse, house', words: ['mouse', 'house'] },
      { big: '-ug', title: 'bug, mug', words: ['bug', 'mug'] },
      { big: '-an', title: 'pan, van, fan, can', words: ['pan', 'van', 'fan', 'can'] },
      { big: '-air', title: 'bear, pear, chair', words: ['bear', 'pear', 'chair'] },
      { big: '-ing', title: 'king, ring', words: ['king', 'ring'] },
      { big: '-ock', title: 'clock, sock, rock, lock', words: ['clock', 'sock', 'rock', 'lock'] },
      { big: '-ose', title: 'nose, rose', words: ['nose', 'rose'] },
      { big: '-ain', title: 'train, rain, chain', words: ['train', 'rain', 'chain'] },
      { big: '-ish', title: 'fish, dish', words: ['fish', 'dish'] },
      { big: '-ight', title: 'kite, light, night', words: ['kite', 'light', 'night'] },
      { big: '-ice', title: 'mice, dice, rice', words: ['mice', 'dice', 'rice'] },
      { big: '-ell', title: 'bell, shell', words: ['bell', 'shell'] },
      { big: '-ail', title: 'snail, nail, whale', words: ['snail', 'nail', 'whale'] },
    ],
  },
  {
    id: 'syll', name: 'Syllables', icon: '👏', view: 'clap',
    intro: 'A syllable is a beat in a word. Clap once for each beat: rab-bit has two.',
    tip: 'Clap the beats: but-ter-fly!',
  },
  {
    id: 'onset', name: 'Onset and Rime', icon: '🧲', view: 'onset',
    intro: 'The onset is the first sound (c), the rime is the rest (at). Put them together: c… at, cat!',
    tip: 'c… at… cat! Stick them together!',
  },
  {
    id: 'first', name: 'Initial Sounds', icon: '🥇', view: 'sounds',
    intro: 'Listen for the very first sound in a word: sun starts with sss.',
    tip: 'What sound does it start with?',
  },
  {
    id: 'last', name: 'Final Sounds', icon: '🏁', view: 'sounds',
    intro: 'Listen for the very last sound in a word: cat ends with t.',
    tip: 'Listen to the end of the word!',
  },
  {
    id: 'middle', name: 'Medial Sounds', icon: '🎯', view: 'sounds',
    intro: 'The middle sound of a three-sound word is usually a vowel: c-a-t has a in the middle.',
    tip: 'What is in the middle? c… a… t!',
  },
  {
    id: 'oblend', name: 'Blending Phonemes', icon: '🎁', view: 'words',
    intro: 'Mystery pictures! Hear the sounds without seeing letters, work out the word, then reveal the picture.',
    tip: 'What is in the mystery box? Listen!',
    words: ['c-a-t', 'd-o-g', 's-u-n', 'p-i-g', 'b-e-d', 'f-i-sh', 'sh-i-p', 'm-oo-n', 'b-ee', 'g-oa-t', 'r-ai-n', 'd-u-ck', 'f-r-o-g', 'k-i-t-e', 'c-a-k-e', 'c-u-p'],
  },
  {
    id: 'oseg', name: 'Segmenting Phonemes', icon: '🔢', view: 'boxes',
    intro: 'Break a spoken word into its sounds and count them: fish has three sounds, f-i-sh.',
    tip: 'How many sounds can you hear?',
  },
  {
    id: 'swap', name: 'Manipulating Phonemes', icon: '🔄', view: 'swap',
    intro: 'Change one sound to make a new word: cat, change c to h… hat!',
    tip: 'Swap a sound, make a new word!',
  },

  /* ----- Letter-sound correspondence ----- */
  {
    id: 'names', name: 'Letter Names', icon: '🔠', view: 'names',
    intro: 'Every letter has a name (bee) and a sound (b). Tap a letter to hear both, then the picture word.',
    tip: 'B is called bee, but it says b!',
  },
  {
    id: 'cons', name: 'Consonant Sounds', icon: '🐝', view: 'cards',
    intro: 'Tap a card to see the sound and an example word.',
    tip: 'Every letter has its own sound. Let’s listen!',
    cards: [
      { symbol: 'b', exampleWords: ['ball'], sound: 'buh' },
      { symbol: 'c', exampleWords: ['cat'], hint: 'Hard c says k. Before e, i or y it usually says s, as in city.', sound: 'kuh' },
      { symbol: 'd', exampleWords: ['dog'], sound: 'duh' },
      { symbol: 'f', exampleWords: ['fish'], sound: 'fuh' },
      { symbol: 'g', exampleWords: ['goat'], hint: 'Hard g as in goat. Before e, i or y it can say j, as in gem.', sound: 'guh' },
      { symbol: 'h', exampleWords: ['hat'], sound: 'huh' },
      { symbol: 'j', exampleWords: ['jam'], sound: 'juh' },
      { symbol: 'k', exampleWords: ['kite'], sound: 'kuh' },
      { symbol: 'l', exampleWords: ['lion'], sound: 'luh' },
      { symbol: 'm', exampleWords: ['moon'], sound: 'muh' },
      { symbol: 'n', exampleWords: ['nest'], sound: 'nuh' },
      { symbol: 'p', exampleWords: ['pig'], sound: 'puh' },
      { symbol: 'q', exampleWords: ['queen'], sound: 'kwuh' },
      { symbol: 'r', exampleWords: ['rabbit'], sound: 'ruh' },
      { symbol: 's', exampleWords: ['sun'], sound: 'suh' },
      { symbol: 't', exampleWords: ['tent'], sound: 'tuh' },
      { symbol: 'v', exampleWords: ['van'], sound: 'vuh' },
      { symbol: 'w', exampleWords: ['web'], sound: 'wuh' },
      { symbol: 'x', exampleWords: ['box'], hint: 'x says ks, as at the end of box.', sound: 'kuss' },
      { symbol: 'y', exampleWords: ['yak'], sound: 'yuh' },
      { symbol: 'z', exampleWords: ['zebra'], sound: 'zuh' },
    ],
  },
  {
    id: 'long', name: 'Long Vowels', icon: '🦄', view: 'cards',
    intro: 'Long vowels say their own name: a in cake, e in tree, i in kite, o in boat, u in cube.',
    tip: 'Long vowels say their name!',
    cards: [
      { symbol: 'ā', exampleWords: ['cake', 'rain', 'baby', 'game'], tag: 'long', sound: 'ay' },
      { symbol: 'ē', exampleWords: ['tree', 'me', 'feet', 'equal'], tag: 'long', sound: 'ee' },
      { symbol: 'ī', exampleWords: ['kite', 'night', 'ice', 'light'], tag: 'long', sound: 'eye' },
      { symbol: 'ō', exampleWords: ['boat', 'rope', 'note', 'go'], tag: 'long', sound: 'oh' },
      { symbol: 'ū', exampleWords: ['unicorn', 'cute', 'music', 'cube'], tag: 'long', sound: 'you' },
    ],
  },
  {
    id: 'dg', name: 'Consonant Digraphs', icon: '🚂', view: 'cards',
    intro: 'Two letters team up to make one new sound (not a blend).',
    tip: 'Two letters, one new sound. Shhh!',
    cards: digraphs,
  },
  {
    id: 'vb', name: 'Vowel Teams', icon: '👯', view: 'cards',
    intro: 'Two letters that work together to make one vowel sound (also called vowel digraphs).',
    tip: 'These letters hold hands and make one sound.',
    cards: VB,
  },
  {
    id: 'cb', name: 'Consonant Blends', icon: '🤝', view: 'cards',
    intro: 'Two consonants blend together; you can still hear both sounds.',
    tip: 'Squish two sounds together: b… l… bl!',
    cards: CB,
  },
  {
    id: 'trig', name: 'Trigraphs', icon: '🔺', view: 'cards',
    intro: 'Three letters that make one sound: tch in witch, igh in night, air in chair.',
    tip: 'Three letters, one sound!',
    cards: TRIG,
  },
  {
    id: 'dp', name: 'Diphthongs', icon: '🎢', view: 'cards',
    intro: 'Two vowel sounds glide together in one syllable.',
    tip: 'Your mouth slides like a slide: oi!',
    cards: diphthongs,
  },
  {
    id: 'rc', name: 'R-Controlled Vowels', icon: '🏴‍☠️', view: 'cards',
    intro: 'Bossy R changes the vowel sound before it.',
    tip: 'Bossy R talks like a pirate. Arrr!',
    cards: rControlled,
  },
  {
    id: 'schwa', name: 'Schwa', icon: '😴', view: 'groups',
    intro: 'Schwa is the most common vowel sound in English: the lazy "uh" in banana, sofa and lemon.',
    tip: 'Sleepy vowels just say "uh"!',
    groups: [
      { big: 'ə', title: 'The lazy "uh" sound', sub: 'In a quiet part of a word, a vowel can relax and just say "uh".', words: ['banana', 'sofa', 'panda', 'zebra', 'lemon', 'pencil', 'circus'] },
    ],
  },

  /* ----- Basic word patterns ----- */
  {
    id: 'vc', name: 'VC Words', icon: '🔡', view: 'words',
    intro: 'Vowel, consonant: tiny two-sound words like at, in, up. Great first words to blend.',
    tip: 'Just two sounds: u… p… up!',
    words: ['a-t', 'a-n', 'a-m', 'i-n', 'i-t', 'i-f', 'u-p', 'u-s', 'o-n', 'o-x', 'a-x'],
  },
  {
    id: 'cvcc', name: 'CVCC Words', icon: '✋', view: 'words',
    intro: 'Consonant, vowel, two consonants: words that end with a blend, like hand and nest.',
    tip: 'Listen for two sounds at the end: ha-n-d!',
    words: ['h-a-n-d', 't-e-n-t', 'n-e-s-t', 'm-i-l-k', 'g-i-f-t', 'l-a-m-p', 'j-u-m-p', 'd-e-s-k', 'b-e-l-t', 'w-i-n-d', 'm-a-s-k', 'p-o-n-d'],
  },
  {
    id: 'ccvc', name: 'CCVC Words', icon: '🐸', view: 'words',
    intro: 'Two consonants, vowel, consonant: words that start with a blend, like frog and drum.',
    tip: 'Two sounds at the start: f-r-og!',
    words: ['f-r-o-g', 'c-r-a-b', 'd-r-u-m', 'f-l-a-g', 's-l-e-d', 'c-l-a-p', 's-w-i-m', 's-t-o-p', 'p-l-u-g', 's-n-a-p', 't-r-i-p', 's-p-o-t'],
  },
  {
    id: 'ccvcc', name: 'CCVCC Words', icon: '🪴', view: 'words',
    intro: 'Blends at both ends, like plant and stamp. Five sounds, still one short vowel.',
    tip: 'Big words with blends at both ends!',
    words: ['p-l-a-n-t', 's-t-a-m-p', 'c-r-u-s-t', 'f-r-o-s-t', 'b-l-e-n-d', 't-w-i-s-t', 's-p-e-n-t', 'g-r-a-n-d', 'c-l-a-m-p', 's-t-u-m-p', 't-r-u-n-k', 's-k-u-n-k'],
  },
  {
    id: 'cvce', name: 'CVCe Words', icon: '🚲', view: 'words',
    intro: 'Consonant, vowel, consonant, silent e: the e makes the vowel say its name, like cake and bike.',
    tip: 'The e is quiet, but it makes the vowel say its name!',
    words: ['c-a-k-e', 'b-i-k-e', 'r-o-p-e', 'c-u-b-e', 'k-i-t-e', 'b-o-n-e', 'n-o-s-e', 'r-o-s-e', 'g-a-t-e', 'f-i-v-e', 'c-o-n-e', 'l-a-k-e'],
  },
  {
    id: 'vce', name: 'VCe Words', icon: '🦍', view: 'words',
    intro: 'Vowel, consonant, silent e: short words like ape and ice where the vowel says its name.',
    tip: 'a… p… e is quiet… ape!',
    words: ['a-p-e', 'i-c-e', 'a-t-e', 'a-g-e', 'u-s-e', 'a-c-e'],
  },
  {
    id: 'open', name: 'Open Syllables', icon: '🚪', view: 'groups',
    intro: 'An open syllable ends with a vowel (go, me, ba-by). The door is open, so the vowel says its long name.',
    tip: 'Open door: the vowel shouts its name!',
    groups: [
      { big: '🚪', title: 'Open syllables', sub: 'The syllable ends with a vowel, so the vowel says its name.', words: ['go', 'me', 'hi', 'no', 'she', 'we', 'baby', 'tiger', 'robot', 'zebra'] },
      { big: '🔒', title: 'Compare: closed', sub: 'A consonant closes the door, so the vowel is short.', words: ['cat', 'up', 'sun', 'rabbit'] },
    ],
  },
  {
    id: 'closed', name: 'Closed Syllables', icon: '🔒', view: 'groups',
    intro: 'A closed syllable ends with a consonant (cat, up, rab-bit). The consonant shuts the door, so the vowel stays short.',
    tip: 'Closed door: the vowel stays short!',
    groups: [
      { big: '🔒', title: 'Closed syllables', sub: 'A consonant closes the syllable, so the vowel is short.', words: ['cat', 'up', 'sun', 'bed', 'it', 'rabbit', 'napkin', 'magnet', 'basket', 'sunset'] },
      { big: '🚪', title: 'Compare: open', sub: 'No consonant at the end: the vowel says its name.', words: ['go', 'me', 'tiger'] },
    ],
  },

  /* ----- Consonants ----- */
  {
    id: 'initial', name: 'Initial Consonants', icon: '🔤', view: 'letters',
    intro: 'Match the first sound of a word to its letter: ball starts with b.',
    tip: 'Which letter does it start with?',
  },
  {
    id: 'final', name: 'Final Consonants', icon: '🔚', view: 'letters',
    intro: 'Match the last sound of a word to its letter: cat ends with t.',
    tip: 'Which letter is at the end?',
  },
  {
    id: 'silent', name: 'Silent Consonants', icon: '🤫', view: 'groups',
    intro: 'Some letters are written but not heard: the k in knife, the w in write, the b in lamb.',
    tip: 'Shh! Some letters are silent!',
    groups: [
      { big: 'kn', title: 'kn says n', sub: 'The k is silent.', words: ['knife', 'knot', 'knee'] },
      { big: 'wr', title: 'wr says r', sub: 'The w is silent.', words: ['write', 'wrench', 'wrap'] },
      { big: 'mb', title: 'mb says m', sub: 'The b is silent.', words: ['lamb', 'thumb', 'comb', 'climb'] },
      { big: 'gh · gn', title: 'gh says g, gn says n', sub: 'The h or g is silent.', words: ['ghost', 'gnome', 'sign'] },
    ],
  },
  {
    id: 'softc', name: 'Hard and Soft C', icon: '🏙️', view: 'groups',
    intro: 'c has two sounds. Hard c says k (cat). Soft c says s when e, i or y comes next (city, ice).',
    tip: 'c says k in cat, but s in city!',
    groups: [
      { big: 'c = k', title: 'Hard c', sub: 'Before a, o or u, c says k.', words: ['cat', 'cup', 'cake', 'car', 'corn', 'cow'] },
      { big: 'c = s', title: 'Soft c', sub: 'Before e, i or y, c says s.', words: ['city', 'ice', 'rice', 'mice', 'circle', 'pencil'] },
    ],
  },
  {
    id: 'softg', name: 'Hard and Soft G', icon: '🦒', view: 'groups',
    intro: 'g has two sounds. Hard g says g (goat). Soft g often says j before e, i or y (giraffe, page).',
    tip: 'g says g in goat, but j in giraffe!',
    groups: [
      { big: 'g = g', title: 'Hard g', sub: 'Usually g says g.', words: ['goat', 'gate', 'frog', 'bag', 'girl', 'gift'] },
      { big: 'g = j', title: 'Soft g', sub: 'Before e, i or y, g often says j.', words: ['giraffe', 'gem', 'page', 'orange', 'magic', 'cage'] },
    ],
  },

  /* ----- Vowels ----- */
  {
    id: 'magice', name: 'Silent E', icon: '✨', view: 'magic',
    intro: 'Add a silent e to the end and the vowel says its name: kit becomes kite, pin becomes pine.',
    tip: 'Wave the magic wand: kit… kite!',
  },
  {
    id: 'combos', name: 'Vowel Combinations', icon: '🏘️', view: 'groups',
    intro: 'One sound, many spellings: long a can be ai (rain), ay (play), a_e (cake) or eigh (eight). Each long sound has its own house of spellings.',
    tip: 'One sound can wear lots of letter costumes!',
    groups: [
      { big: 'ā', title: 'Long a', sub: 'ai · ay · a_e · eigh', words: ['rain', 'play', 'cake', 'eight'] },
      { big: 'ē', title: 'Long e', sub: 'ee · ea · ey · y', words: ['bee', 'leaf', 'key', 'baby'] },
      { big: 'ī', title: 'Long i', sub: 'igh · ie · i_e · y', words: ['night', 'pie', 'kite', 'fly'] },
      { big: 'ō', title: 'Long o', sub: 'oa · ow · o_e · oe', words: ['boat', 'snow', 'rope', 'toe'] },
      { big: 'oo', title: 'Long oo', sub: 'oo · ue · ew · u_e', words: ['moon', 'blue', 'screw', 'flute'] },
    ],
  },

  /* ----- Advanced phonics ----- */
  {
    id: 'stypes', name: 'Syllable Types', icon: '🧰', view: 'groups',
    intro: 'Every syllable is one of six types. Knowing the type tells you what the vowel will say.',
    tip: 'Six kinds of syllables. Can you sort them?',
    groups: [
      { big: '🔒', title: 'Closed', sub: 'Ends with a consonant: short vowel.', words: ['cat', 'basket', 'rabbit'] },
      { big: '🚪', title: 'Open', sub: 'Ends with a vowel: long vowel.', words: ['go', 'tiger', 'robot'] },
      { big: '✨', title: 'Magic e', sub: 'Silent e makes the vowel long.', words: ['cake', 'kite', 'cube'] },
      { big: '👯', title: 'Vowel team', sub: 'Two vowels team up.', words: ['rain', 'boat', 'tree'] },
      { big: '🏴‍☠️', title: 'Bossy R', sub: 'r changes the vowel.', words: ['car', 'bird', 'corn'] },
      { big: '🕯️', title: 'Consonant-le', sub: 'A consonant + le at the end.', words: ['apple', 'candle', 'turtle'] },
    ],
  },
  {
    id: 'sdiv', name: 'Syllable Division', icon: '🔪', view: 'groups',
    intro: 'Long words are easier in chunks. These rules show where to split a word into syllables.',
    tip: 'Chop big words into small pieces!',
    groups: [
      { big: 'VC|CV', title: 'Between two consonants', sub: 'Split between the two consonants. The first vowel is short.', words: ['rabbit', 'napkin', 'basket', 'muffin', 'picnic', 'magnet'] },
      { big: 'V|CV', title: 'After a long vowel', sub: 'Try splitting after the vowel first. It says its name.', words: ['tiger', 'robot', 'paper', 'music', 'baby'] },
      { big: 'VC|V', title: 'After a consonant', sub: 'If the long vowel sounds wrong, split after the consonant.', words: ['cabin', 'lemon', 'seven', 'wagon'] },
      { big: 'C+le', title: 'Consonant + le', sub: 'Keep the consonant with le.', words: ['table', 'candle', 'turtle', 'apple'] },
    ],
  },
  {
    id: 'multi', name: 'Multisyllabic Words', icon: '🦋', view: 'clap',
    intro: 'Read long words one chunk at a time, then put the chunks together: pump… kin… pumpkin!',
    tip: 'Read one chunk at a time!',
  },
  {
    id: 'prefix', name: 'Prefixes', icon: '⬅️', view: 'builder',
    intro: 'A prefix goes at the start of a word and changes its meaning: un means not, re means again.',
    tip: 'Add a piece to the front: un + happy!',
  },
  {
    id: 'suffix', name: 'Suffixes', icon: '➡️', view: 'builder',
    intro: 'A suffix goes at the end of a word: -er (farmer), -ful (helpful), -less (fearless), -ly (slowly), -est (biggest).',
    tip: 'Add a piece to the end: help + ful!',
  },
  {
    id: 'inflect', name: 'Inflectional Endings', icon: '🏷️', view: 'builder',
    intro: 'Endings that change number or time: -s and -es (cats, boxes), -ing (jumping) and -ed (jumped).',
    tip: 'One cat, two cats!',
  },
  {
    id: 'morph', name: 'Morphology', icon: '🧱', view: 'builder',
    intro: 'Morphology is the study of word parts. Small words join into compound words (sun + flower), and parts like un-, re-, -ful and -ing build new words.',
    tip: 'Sun + flower = sunflower!',
  },
  {
    id: 'sight', name: 'Irregular & High-Frequency Words', icon: '❤️', view: 'sight',
    intro: 'Words we read all the time. The highlighted part does not follow the usual rules, so we learn it "by heart".',
    tip: 'Learn the tricky part by heart!',
  },
  {
    id: 'advspell', name: 'Advanced Spelling Patterns', icon: '🎓', view: 'groups',
    intro: 'Spelling choices that depend on position and the vowel before: tch/ch, dge/ge, ai/ay, oi/oy, plus ph, y and tion.',
    tip: 'Which spelling looks right?',
    groups: [
      { big: 'tch · ch', title: 'tch or ch?', sub: 'After a short vowel use tch (catch). Otherwise ch (lunch, chin).', words: ['catch', 'witch', 'lunch', 'chin'] },
      { big: 'dge · ge', title: 'dge or ge?', sub: 'After a short vowel use dge (badge). Otherwise ge (cage).', words: ['badge', 'bridge', 'cage', 'page'] },
      { big: 'ai · ay', title: 'ai or ay?', sub: 'ai in the middle (rain), ay at the end (play).', words: ['rain', 'snail', 'play', 'day'] },
      { big: 'oi · oy', title: 'oi or oy?', sub: 'oi in the middle (coin), oy at the end (boy).', words: ['coin', 'oil', 'boy', 'toy'] },
      { big: 'ph', title: 'ph says f', sub: 'Often in longer words from Greek.', words: ['phone', 'dolphin', 'elephant', 'photo'] },
      { big: 'y', title: 'y at the end', sub: 'Says ī in short words (fly), ē in longer words (baby).', words: ['fly', 'cry', 'baby', 'candy'] },
      { big: 'tion', title: 'tion says shun', sub: 'A very common word ending.', words: ['station', 'lotion', 'action'] },
    ],
  },

  /* ----- Reading application ----- */
  {
    id: 'blend', name: 'Blending', icon: '🧩', view: 'words',
    intro: 'Listen to each sound, then hear them blend into a word.',
    tip: 'Listen to the sounds, then say the word!',
    words: ['c-a-t', 's-u-n', 'p-i-g', 'd-o-g', 'b-u-s', 'h-e-n', 'sh-i-p', 'fr-o-g', 'ch-i-p', 'cl-a-p', 'st-o-p', 'th-i-n'],
  },
  {
    id: 'segment', name: 'Segmenting', icon: '🟦', view: 'boxes',
    intro: 'Count sounds, not letters: ship has 4 letters but 3 sounds (sh-i-p). Each box holds one sound.',
    tip: 'Sounds, not letters! sh is one sound.',
  },
  {
    id: 'decode', name: 'Decoding', icon: '🔎', view: 'words',
    intro: 'Decoding is reading a new word by its sounds: look, say each sound, blend, then check it makes sense.',
    tip: 'Look, say, blend, check!',
    words: ['sh-i-p', 'ch-i-p', 'r-ai-n', 'b-oa-t', 'k-i-t-e', 's-t-ar', 'b-ir-d', 'c-oi-n', 'f-r-o-g', 'n-igh-t', 'c-a-k-e', 'm-oo-n', 't-r-ee', 'sh-ee-p', 'c-l-ou-d', 'sh-ar-k', 't-r-ai-n', 'd-u-ck', 'f-i-sh', 'c-r-a-b'],
  },
  {
    id: 'encode', name: 'Encoding & Spelling', icon: '🖍️', view: 'dictation',
    intro: 'Encoding is spelling by sound: say the word slowly, hear each sound, and write the letters for it.',
    tip: 'Say it slowly, then spell each sound!',
  },
  {
    id: 'wordread', name: 'Word Reading', icon: '⚡', view: 'flash',
    intro: 'Quick word practice: read the word, then tap to check. Words you can read instantly free up your brain for meaning.',
    tip: 'Read it, then check it!',
  },
  {
    id: 'sentread', name: 'Sentence Reading', icon: '💬', view: 'sentences',
    intro: 'Sentences that mix everything: blends, digraphs, long vowels and bossy R.',
    tip: 'Read the whole sentence!',
  },
  {
    id: 'texts', name: 'Decodable Texts', icon: '📚', view: 'stories',
    intro: 'Short stories made from sounds children have learned. Tap any word to hear it, or listen to the whole story.',
    tip: 'Read a little story!',
  },
  {
    id: 'fluency', name: 'Fluency Practice', icon: '⏱️', view: 'fluency',
    intro: 'Fluency is reading smoothly, at a comfortable speed, with expression. Listen, echo, then time yourself and beat your best.',
    tip: 'Listen, echo, then read it yourself!',
  },
];

export const topicCategories: TopicCategory[] = [
  { id: 'sv', name: 'Short Vowels', icon: '🍎', topicIds: ['short', 'cvc', 'families', 'pairs', 'svblend', 'svseg', 'dictation', 'svsent', 'svmix', 'svspell'] },
  { id: 'pa', name: 'Phonemic Awareness', icon: '👂', topicIds: ['listen', 'rhyme', 'syll', 'onset', 'first', 'last', 'middle', 'oblend', 'oseg', 'swap'] },
  { id: 'ls', name: 'Letter-Sound Correspondence', icon: '🔤', topicIds: ['names', 'cons', 'short', 'long', 'dg', 'vb', 'cb', 'trig', 'dp', 'rc', 'schwa'] },
  { id: 'wp', name: 'Basic Word Patterns', icon: '🧱', topicIds: ['vc', 'cvc', 'cvcc', 'ccvc', 'ccvcc', 'cvce', 'vce', 'open', 'closed'] },
  { id: 'co', name: 'Consonants', icon: '🐝', topicIds: ['cons', 'initial', 'final', 'cb', 'dg', 'trig', 'silent', 'softc', 'softg'] },
  { id: 'vo', name: 'Vowels', icon: '🌈', topicIds: ['short', 'long', 'magice', 'vb', 'dp', 'rc', 'schwa', 'combos'] },
  { id: 'adv', name: 'Advanced Phonics', icon: '🚀', topicIds: ['stypes', 'sdiv', 'multi', 'prefix', 'suffix', 'inflect', 'morph', 'sight', 'advspell'] },
  { id: 'ra', name: 'Reading Application', icon: '📖', topicIds: ['blend', 'segment', 'decode', 'encode', 'wordread', 'sentread', 'texts', 'fluency'] },
];

export function getPhonicsTopic(id: string): PhonicsTopic | undefined {
  return phonicsTopics.find((t) => t.id === id);
}
