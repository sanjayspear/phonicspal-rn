// Shared domain types — see PHONICSPAL_RN_DESIGN_DOC.md for the spec these implement.

export type Role = 'teacher' | 'parent' | 'solo';

// A 'cards'-view topic as v1's js/topics.js and phonics-views.js render it:
// a grid of cards (symbol, example words, optional tag/hint), tap to focus
// one. v1 has ~10 other view types (words, family, boxes, sentences, …) —
// those aren't modeled here yet; see docs/DESIGN.md §5.3 (content
// migration is an open item, this covers only the topics ported so far).
export interface PhonicsCard {
  symbol: string;
  exampleWords: string[];
  tag?: string;
  hint?: string;
}

export interface PhonicsTopic {
  id: string;
  name: string;
  icon: string;
  intro: string;
  tip: string;
  cards: PhonicsCard[];
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
