import { mockLearningPath, type LearningPath } from '@phonicspal/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// Local-only "backend" for Learning Paths, keyed by studentId, persisted to
// AsyncStorage. This is what lets a path a teacher builds actually show up
// on the parent dashboard (same device only, no real sync) — closing the
// loop described in docs/DESIGN.md §4 without the real backend that's
// still an open item (§5). Swap for @phonicspal/api + Firestore
// onSnapshot later; call sites (getPath/savePath) don't need to change.
const STORAGE_KEY = 'phonicspal.learningPaths';

type PathsByStudent = Record<string, LearningPath>;

interface LearningPathsContextValue {
  loading: boolean;
  getPath: (studentId: string) => LearningPath | undefined;
  savePath: (path: LearningPath) => Promise<void>;
}

const LearningPathsContext = createContext<LearningPathsContextValue | null>(null);

const SEED: PathsByStudent = { [mockLearningPath.studentId]: mockLearningPath };

export function LearningPathsProvider({ children }: { children: ReactNode }) {
  const [paths, setPaths] = useState<PathsByStudent>(SEED);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setPaths(JSON.parse(raw) as PathsByStudent);
      })
      .finally(() => setLoading(false));
  }, []);

  const value: LearningPathsContextValue = {
    loading,
    getPath: (studentId) => paths[studentId],
    savePath: async (path) => {
      const next = { ...paths, [path.studentId]: path };
      setPaths(next);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    },
  };

  return <LearningPathsContext.Provider value={value}>{children}</LearningPathsContext.Provider>;
}

export function useLearningPaths(): LearningPathsContextValue {
  const ctx = useContext(LearningPathsContext);
  if (!ctx) throw new Error('useLearningPaths must be used within LearningPathsProvider');
  return ctx;
}
