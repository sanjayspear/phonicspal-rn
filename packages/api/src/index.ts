// Typed backend client — see PHONICSPAL_RN_DESIGN_DOC.md §4.
// Real implementation (Firestore onSnapshot, security rules) is an open item
// pending the FIREBASE_CONFIG decision noted in the design doc §5.1.

import type { LearningPath } from '@phonicspal/core';

export interface PhonicsPalApi {
  getLearningPath(studentId: string): Promise<LearningPath | null>;
  subscribeLearningPath(
    studentId: string,
    onChange: (path: LearningPath) => void
  ): () => void; // returns an unsubscribe function
  submitNode(pathId: string, nodeId: string): Promise<void>;
}
