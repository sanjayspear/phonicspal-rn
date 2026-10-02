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

// Catalogued but not yet interactive — see header comment.
export interface PendingTopic extends PhonicsTopicBase {
  view: Exclude<PhonicsViewType, 'cards' | 'groups' | 'words'>;
}

export type PhonicsTopic = CardsTopic | GroupsTopic | WordsTopic | PendingTopic;

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
}

// A roster entry as the teacher dashboard shows it — a read-model, not the
// full student record.
export interface StudentSummary {
  id: string;
  name: string;
  topicsCompleted: number;
  topicsTotal: number;
  stars: number;
  lastActiveLabel: string;
}

export interface ActivityEvent {
  id: string;
  studentName: string;
  summary: string;
  whenLabel: string;
}
