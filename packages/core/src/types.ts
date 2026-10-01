// Shared domain types — see PHONICSPAL_RN_DESIGN_DOC.md for the spec these implement.

export type Role = 'teacher' | 'parent' | 'solo';

// Ported from the v1 topics.js shape (62 topics / 8 groups). Fields kept
// minimal here; actual topic content is migrated separately, not invented.
export interface PhonicsTopic {
  id: string;
  groupId: string;
  title: string;
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
