// Placeholder fixtures for the Role Dashboard screens (docs/DESIGN.md §1.2).
// There is no backend yet (open item in docs/DESIGN.md §5), so the Teacher
// and Parent dashboards render against this static data instead of a real
// roster/Learning Path. Swap for `@phonicspal/api` calls once that exists —
// the shapes here (StudentSummary, LearningPath) are the real domain types,
// not a throwaway stub shape.

import type { ActivityEvent, LearningPath, LearningPathNode, StudentSummary } from './types';
import { getPhonicsTopic } from './topics';

export const mockRoster: StudentSummary[] = [
  { id: 's1', name: 'Mia', topicsCompleted: 14, topicsTotal: 62, stars: 23, lastActiveLabel: 'Today' },
  { id: 's2', name: 'Noah', topicsCompleted: 9, topicsTotal: 62, stars: 15, lastActiveLabel: 'Yesterday' },
  { id: 's3', name: 'Ava', topicsCompleted: 21, topicsTotal: 62, stars: 34, lastActiveLabel: '2 days ago' },
  { id: 's4', name: 'Leo', topicsCompleted: 4, topicsTotal: 62, stars: 6, lastActiveLabel: '5 days ago' },
];

export const mockActivity: ActivityEvent[] = [
  { id: 'a1', studentName: 'Mia', summary: 'Submitted Blending CVC Words', whenLabel: '2h ago' },
  { id: 'a2', studentName: 'Ava', summary: 'Earned 3 stars in Short Vowels', whenLabel: '5h ago' },
  { id: 'a3', studentName: 'Noah', summary: 'Submitted Sound Boxes: sh, ch', whenLabel: 'Yesterday' },
];

export const mockChildName = 'Mia';

export const mockLearningPath: LearningPath = {
  id: 'lp1',
  classId: 'c1',
  studentId: 's1',
  createdBy: 'teacher1',
  updatedAt: new Date().toISOString(),
  nodes: [
    { id: 'n1', order: 0, type: 'topic', refId: 'blend-cvc', status: 'submitted' },
    { id: 'n2', order: 1, type: 'topic', refId: 'sound-boxes-sh-ch', status: 'submitted' },
    { id: 'n3', order: 2, type: 'topic', refId: 'short-vowels', status: 'in_progress' },
    { id: 'n4', order: 3, type: 'assignment', refId: 'read-3-pages-aloud', status: 'locked' },
    { id: 'n5', order: 4, type: 'topic', refId: 'word-families-at-an', status: 'locked' },
  ],
};

// Display titles for the seed path's refIds above, which predate the real
// ported topics (docs/DESIGN.md §5.3) — stands in for the content that
// would exist once all 62 topics are migrated.
export const mockNodeTitles: Record<string, string> = {
  'blend-cvc': 'Blending CVC Words',
  'sound-boxes-sh-ch': 'Sound Boxes: sh, ch',
  'short-vowels': 'Short Vowels',
  'read-3-pages-aloud': 'Read 3 pages aloud',
  'word-families-at-an': 'Word Families: -at, -an',
};

// A node's display title: a real ported topic, one of the legacy seed
// titles above (the seed path's assignment node uses a slug refId that
// needs this lookup same as its topic nodes do), or — for a free-text
// assignment node created via the builder — the text itself, since there
// nothing else to look up.
export function getNodeTitle(node: Pick<LearningPathNode, 'refId' | 'type'>): string {
  if (node.type === 'topic') return getPhonicsTopic(node.refId)?.name ?? mockNodeTitles[node.refId] ?? node.refId;
  return mockNodeTitles[node.refId] ?? node.refId;
}
