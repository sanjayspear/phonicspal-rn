// The 37-word starter dictionary, ported verbatim from v1's js/dictionary.js
// (word, part of speech, meaning, one example sentence). v1 also has an
// online lookup (Free Dictionary API, with Wiktionary/Datamuse fallbacks)
// for words outside this list — that's a network-dependent feature not
// ported yet; this app's Vocab screen works against the starter list only.

export interface DictionaryWord {
  w: string;
  p: string;
  m: string;
  e: string;
}

export const starterDictionary: DictionaryWord[] = [
  { w: 'butterfly', p: 'noun', m: 'a colorful insect with big wings', e: 'The butterfly landed on a flower.' },
  { w: 'curious', p: 'adjective', m: 'wanting to learn or know more', e: 'The curious cat looked in the box.' },
  { w: 'village', p: 'noun', m: 'a small town in the countryside', e: 'Our village has one little school.' },
  { w: 'wander', p: 'verb', m: 'to walk around with no plan', e: 'We wander through the park.' },
  { w: 'giant', p: 'adjective', m: 'very, very big', e: 'A giant tree stood by the river.' },
  { w: 'gentle', p: 'adjective', m: 'soft and kind', e: 'Be gentle with the baby bird.' },
  { w: 'happy', p: 'adjective', m: 'feeling glad and cheerful', e: 'I am happy to see you.' },
  { w: 'friend', p: 'noun', m: 'someone you like and enjoy being with', e: 'My friend shares her toys.' },
  { w: 'story', p: 'noun', m: 'words that tell about things that happen', e: 'Dad read me a bedtime story.' },
  { w: 'animal', p: 'noun', m: 'a living thing that is not a plant', e: 'A dog is an animal.' },
  { w: 'garden', p: 'noun', m: 'a place where flowers or food grow', e: 'We planted seeds in the garden.' },
  { w: 'river', p: 'noun', m: 'a long stream of water', e: 'The river runs to the sea.' },
  { w: 'forest', p: 'noun', m: 'a big area full of trees', e: 'Deer live in the forest.' },
  { w: 'brave', p: 'adjective', m: 'not afraid to do hard things', e: 'The brave girl climbed the hill.' },
  { w: 'quiet', p: 'adjective', m: 'making very little sound', e: 'Please be quiet in the library.' },
  { w: 'bright', p: 'adjective', m: 'giving a lot of light', e: 'The sun is bright today.' },
  { w: 'smile', p: 'noun', m: 'a happy look on your face', e: 'Her smile made me happy.' },
  { w: 'family', p: 'noun', m: 'parents, children and relatives', e: 'My family eats dinner together.' },
  { w: 'school', p: 'noun', m: 'a place where children learn', e: 'I walk to school with my sister.' },
  { w: 'dream', p: 'noun', m: 'pictures your mind makes while you sleep', e: 'I had a dream about flying.' },
  { w: 'planet', p: 'noun', m: 'a big round world that moves around a star', e: 'Earth is our planet.' },
  { w: 'ocean', p: 'noun', m: 'a very large body of salt water', e: 'Whales swim in the ocean.' },
  { w: 'rabbit', p: 'noun', m: 'a small furry animal with long ears', e: 'The rabbit hopped away.' },
  { w: 'castle', p: 'noun', m: 'a big stone building where kings and queens lived', e: 'The castle had tall towers.' },
  { w: 'whisper', p: 'verb', m: 'to speak very softly', e: "Whisper so you don't wake her." },
  { w: 'journey', p: 'noun', m: 'a long trip from one place to another', e: 'Our journey took three days.' },
  { w: 'magic', p: 'noun', m: 'special power that seems impossible', e: 'The wizard used magic.' },
  { w: 'clever', p: 'adjective', m: 'quick to learn and smart', e: 'The clever fox solved the puzzle.' },
  { w: 'window', p: 'noun', m: 'glass in a wall that lets in light', e: 'I looked out of the window.' },
  { w: 'morning', p: 'noun', m: 'the first part of the day', e: 'I eat breakfast in the morning.' },
  { w: 'yellow', p: 'adjective', m: 'the color of a banana or the sun', e: 'She wore a yellow hat.' },
  { w: 'travel', p: 'verb', m: 'to go from one place to another', e: 'We travel by train.' },
  { w: 'mountain', p: 'noun', m: 'a very high hill', e: 'Snow sits on top of the mountain.' },
  { w: 'treasure', p: 'noun', m: 'gold, jewels and other valuable things', e: 'The pirates hid their treasure.' },
  { w: 'rainbow', p: 'noun', m: 'colored arcs in the sky after rain', e: 'We saw a rainbow after the storm.' },
  { w: 'book', p: 'noun', m: 'pages with words or pictures fastened together', e: 'I borrowed a book about space.' },
  { w: 'read', p: 'verb', m: 'to look at words and understand them', e: 'I love to read every night.' },
];
