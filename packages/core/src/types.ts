// Shared domain types — see PHONICSPAL_RN_DESIGN_DOC.md for the spec these implement.

export type Role = 'teacher' | 'parent' | 'solo';

// v1's js/topics.js has 62 topics across 22 distinct "view" types (cards,
// groups, words, family, boxes, sentences, builder, …) — each view type is
// a genuinely different page layout in v1's phonics-views.js. All 62
// topics' catalog metadata (id/name/icon/intro/tip) is ported so Phonics
// browsing is complete, but only the view types with a real renderer in
// this app (see apps/app's phonics screens) are interactive; the rest
// carry their real data/intro/tip but render a "coming soon" placeholder
// until a matching view component exists. This is tracked honestly via
// the `view` tag — never silently stubbed as 'cards'.

export interface PhonicsCard {
  symbol: string;
  exampleWords: string[];
  tag?: string;
  hint?: string;
  // A TTS-safe phonetic respelling of `symbol`, read aloud instead of it
  // when set. Needed because speech engines read an isolated single
  // letter as its alphabet name (e.g. 'b' -> "bee") rather than the phonic
  // sound a phonics card is actually teaching (e.g. "buh") — and a few
  // multi-letter graphemes are taught as a different sound than their
  // spelling implies (e.g. 'ck' says /k/, not "see-kay"). Falls back to
  // `symbol` when unset, for graphemes plain TTS already says correctly.
  sound?: string;
}

export interface PhonicsGroup {
  big: string;
  title: string;
  sub?: string;
  words: string[];
}

// A 'words'-view item is a hyphen-joined sound sequence, e.g. 'c-a-t' or
// 'sh-i-p' — tap to blend the sounds into the whole word.
export type PhonicsWordItem = string;

// One rime ("-at") and the onset letters that build real words from it
// ("c" + at -> cat) — a 'family'-view topic's interactive unit.
export interface WordFamily {
  rime: string;
  onsets: { letter: string; word: string }[];
}

// A high-frequency/irregular word with the span (into `word`) that doesn't
// follow regular phonics rules, highlighted separately in the UI — e.g.
// 'said' with trickyStart 1, trickyEnd 3 highlights the "ai".
export interface SightWordEntry {
  word: string;
  trickyStart: number;
  trickyEnd: number;
}

// Two words for a same/different listening round.
export interface SoundPair {
  a: string;
  b: string;
  same: boolean;
}

// A word pre-split into the syllable chunks a 'clap'-view topic claps out.
export interface ClapWord {
  word: string;
  syllables: string[];
}

// A word plus the single letter a 'letters'-view topic asks the child to
// match (its first letter for an "Initial Consonants" topic, its last for
// "Final Consonants" — the topic itself decides which end `letter` is).
export interface LetterMatchWord {
  word: string;
  letter: string;
}

// A word already split into sound segments (reuses the same 'c-a-t' shape
// words.ts's 'words' view uses), plus which segment a 'sounds'-view topic
// is asking about — index 0 for Initial Sounds, the last index for Final
// Sounds, 1 for Medial Sounds (all current source words are 3 segments).
export interface SoundFocusWord {
  segments: string[];
  focusIndex: number;
}

export type PhonicsViewType =
  | 'cards'
  | 'groups'
  | 'words'
  | 'family'
  | 'pairs'
  | 'boxes'
  | 'dictation'
  | 'sentences'
  | 'mix'
  | 'listen'
  | 'clap'
  | 'onset'
  | 'sounds'
  | 'swap'
  | 'names'
  | 'letters'
  | 'magic'
  | 'builder'
  | 'sight'
  | 'flash'
  | 'stories'
  | 'fluency';

interface PhonicsTopicBase {
  id: string;
  name: string;
  icon: string;
  intro: string;
  tip: string;
}

export interface CardsTopic extends PhonicsTopicBase {
  view: 'cards';
  cards: PhonicsCard[];
}

export interface GroupsTopic extends PhonicsTopicBase {
  view: 'groups';
  groups: PhonicsGroup[];
}

export interface WordsTopic extends PhonicsTopicBase {
  view: 'words';
  words: PhonicsWordItem[];
}

export interface FamilyTopic extends PhonicsTopicBase {
  view: 'family';
  families: WordFamily[];
}

export interface SightTopic extends PhonicsTopicBase {
  view: 'sight';
  words: SightWordEntry[];
}

export interface ListenTopic extends PhonicsTopicBase {
  view: 'listen';
  pairs: SoundPair[];
}

export interface ClapTopic extends PhonicsTopicBase {
  view: 'clap';
  words: ClapWord[];
}

export interface LettersTopic extends PhonicsTopicBase {
  view: 'letters';
  words: LetterMatchWord[];
}

export interface SoundsTopic extends PhonicsTopicBase {
  view: 'sounds';
  words: SoundFocusWord[];
}

const INTERACTIVE_VIEWS = [
  'cards',
  'groups',
  'words',
  'family',
  'sight',
  'listen',
  'clap',
  'letters',
  'sounds',
] as const;

// Catalogued but not yet interactive — see header comment.
export interface PendingTopic extends PhonicsTopicBase {
  view: Exclude<PhonicsViewType, (typeof INTERACTIVE_VIEWS)[number]>;
}

export type PhonicsTopic =
  | CardsTopic
  | GroupsTopic
  | WordsTopic
  | FamilyTopic
  | SightTopic
  | ListenTopic
  | ClapTopic
  | LettersTopic
  | SoundsTopic
  | PendingTopic;

// The 8 browsing categories topics are organized under (v1's GROUPS) — a
// topic can appear in more than one category, same as v1.
export interface TopicCategory {
  id: string;
  name: string;
  icon: string;
  topicIds: string[];
}

export type LearningPathNodeType = 'topic' | 'assignment';
export type LearningPathNodeStatus =
  | 'locked'
  | 'available'
  | 'in_progress'
  | 'submitted'
  | 'reviewed';

export interface LearningPathNode {
  id: string;
  order: number;
  type: LearningPathNodeType;
  refId: string;
  status: LearningPathNodeStatus;
  submittedAt?: string;
  childNote?: string;
}

export interface LearningPath {
  id: string;
  classId: string;
  studentId: string;
  createdBy: string;
  nodes: LearningPathNode[];
  updatedAt: string;
  // Set when this progress record was created from a parent's
  // self-identification form rather than a pre-existing roster entry (the
  // broadcast Learning Path model — see LearningPathTemplate) — this is
  // the only place that name/class/section live, so the teacher's
  // tracking view can show who without a separate roster lookup.
  studentName?: string;
  className?: string;
  section?: string;
}

// The one path a teacher publishes per class — content only (which
// topics/assignments, in order), with no student targeting. A parent
// identifying their child (ChildIdentity) is what turns this into a
// per-student LearningPath progress record (see use-learning-paths.tsx).
export interface LearningPathTemplate {
  classId: string;
  nodes: LearningPathNode[];
  updatedAt: string;
}

// What a parent fills in once, before starting or submitting any homework,
// so the teacher's tracking view knows whose progress it's looking at —
// there's no pre-existing roster the parent picks from, they self-report.
export interface ChildIdentity {
  childName: string;
  studentId: string;
  className: string;
  section: string;
}

export interface ActivityEvent {
  id: string;
  studentName: string;
  summary: string;
  whenLabel: string;
  // Present once activity starts coming from self-identified submissions
  // (ChildIdentity) rather than the old static mock feed.
  studentId?: string;
  className?: string;
  section?: string;
}
