// Placeholder fixtures for the Role Dashboard screens (docs/DESIGN.md §1.2).
// There is no backend yet (open item in docs/DESIGN.md §5), so the Teacher
// dashboard's activity feed starts from this static data instead of a real
// one. The old mockRoster/mockLearningPath/mockChildName (a single
// pre-seeded demo student) were removed once the Learning Path model
// became broadcast + self-identification (docs/DESIGN.md's CR-3) — real
// students now only exist once a parent actually identifies one via
// ChildIdentityForm, so there's nothing meaningful left to pre-seed.

import type { ActivityEvent, LearningPathNode } from './types';
import { getPhonicsTopic } from './topics';

export const mockActivity: ActivityEvent[] = [
  { id: 'a1', studentName: 'Mia', summary: 'Submitted Blending CVC Words', whenLabel: '2h ago' },
  { id: 'a2', studentName: 'Ava', summary: 'Earned 3 stars in Short Vowels', whenLabel: '5h ago' },
  { id: 'a3', studentName: 'Noah', summary: 'Submitted Sound Boxes: sh, ch', whenLabel: 'Yesterday' },
];

// A node's display title: a real ported topic's name for a 'topic' node, or
// the instruction text itself for an 'assignment' node — same thing the
// Learning Path builder (apps/app's build-path screen) stores as refId, so
// there's nothing else to look up.
export function getNodeTitle(node: Pick<LearningPathNode, 'refId' | 'type'>): string {
  if (node.type === 'topic') return getPhonicsTopic(node.refId)?.name ?? node.refId;
  return node.refId;
}
