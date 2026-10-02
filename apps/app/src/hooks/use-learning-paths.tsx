import type { LearningPath, LearningPathNode, LearningPathTemplate } from '@phonicspal/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// Local-only "backend" for Learning Paths, persisted to AsyncStorage — two
// stores:
//   - `template`: the one path a teacher publishes per class (content
//     only, no student targeting — docs/DESIGN.md's broadcast model).
//   - `paths`: per-student PROGRESS records, created lazily the first time
//     a self-identified parent (ChildIdentity) opens the broadcast
//     template, keyed by the studentId they typed in. Submitting a node
//     only ever touches a student's own progress record, never the
//     shared template.
// Same device only, no real sync — closing the loop described in
// docs/DESIGN.md §4 without the real backend that's still an open item
// (§5). Swap for @phonicspal/api + Firestore onSnapshot later; call sites
// don't need to change.
const TEMPLATE_KEY = 'phonicspal.classPathTemplate';
const PATHS_KEY = 'phonicspal.learningPaths';
const CLASS_ID = 'c1';

type PathsByStudent = Record<string, LearningPath>;

interface LearningPathsContextValue {
  loading: boolean;
  template: LearningPathTemplate | null;
  publishTemplate: (nodes: LearningPathNode[]) => Promise<void>;
  getPath: (studentId: string) => LearningPath | undefined;
  getAllPaths: () => LearningPath[];
  savePath: (path: LearningPath) => Promise<void>;
  submitNode: (studentId: string, nodeId: string) => Promise<void>;
}

const LearningPathsContext = createContext<LearningPathsContextValue | null>(null);

export function LearningPathsProvider({ children }: { children: ReactNode }) {
  const [template, setTemplate] = useState<LearningPathTemplate | null>(null);
  const [paths, setPaths] = useState<PathsByStudent>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([AsyncStorage.getItem(TEMPLATE_KEY), AsyncStorage.getItem(PATHS_KEY)])
      .then(([rawTemplate, rawPaths]) => {
        if (rawTemplate) setTemplate(JSON.parse(rawTemplate) as LearningPathTemplate);
        if (rawPaths) setPaths(JSON.parse(rawPaths) as PathsByStudent);
      })
      .finally(() => setLoading(false));
  }, []);

  async function publishTemplate(nodes: LearningPathNode[]) {
    const next: LearningPathTemplate = { classId: CLASS_ID, nodes, updatedAt: new Date().toISOString() };
    setTemplate(next);
    await AsyncStorage.setItem(TEMPLATE_KEY, JSON.stringify(next));
  }

  async function savePath(path: LearningPath) {
    const next = { ...paths, [path.studentId]: path };
    setPaths(next);
    await AsyncStorage.setItem(PATHS_KEY, JSON.stringify(next));
  }

  // Shared by the parent dashboard (assignment nodes, submitted in place)
  // and the guided phonics topic screen (topic nodes, submitted after
  // practice) so "mark this node done, unlock the next one" has one
  // implementation instead of two.
  async function submitNode(studentId: string, nodeId: string) {
    const path = paths[studentId];
    if (!path) return;
    const nodes = [...path.nodes].sort((a, b) => a.order - b.order);
    const index = nodes.findIndex((n) => n.id === nodeId);
    if (index === -1) return;

    const updated = nodes.map((n, i) =>
      i === index ? { ...n, status: 'submitted' as const, submittedAt: new Date().toISOString() } : n
    );
    const after = updated[index + 1];
    if (after?.status === 'locked') updated[index + 1] = { ...after, status: 'available' };

    await savePath({ ...path, nodes: updated, updatedAt: new Date().toISOString() });
  }

  const value: LearningPathsContextValue = {
    loading,
    template,
    publishTemplate,
    getPath: (studentId) => paths[studentId],
    getAllPaths: () => Object.values(paths),
    savePath,
    submitNode,
  };

  return <LearningPathsContext.Provider value={value}>{children}</LearningPathsContext.Provider>;
}

export function useLearningPaths(): LearningPathsContextValue {
  const ctx = useContext(LearningPathsContext);
  if (!ctx) throw new Error('useLearningPaths must be used within LearningPathsProvider');
  return ctx;
}
