import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// Local-only custom stories: Read used to only offer the 5 preset decodable
// stories (packages/core/src/stories.ts) — this is the "paste or write your
// own" counterpart, same AsyncStorage-backed pattern as useBooks, just text
// typed in directly instead of extracted from an uploaded file.
const STORAGE_KEY = 'phonicspal.customStories';

export interface CustomStory {
  id: string;
  title: string;
  text: string;
}

interface CustomStoriesContextValue {
  loading: boolean;
  stories: CustomStory[];
  addStory: (story: Omit<CustomStory, 'id'>) => void;
  removeStory: (id: string) => void;
}

const CustomStoriesContext = createContext<CustomStoriesContextValue | null>(null);

export function CustomStoriesProvider({ children }: { children: ReactNode }) {
  const [stories, setStories] = useState<CustomStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setStories(JSON.parse(raw) as CustomStory[]);
      })
      .finally(() => setLoading(false));
  }, []);

  function persist(next: CustomStory[]) {
    setStories(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  const value: CustomStoriesContextValue = {
    loading,
    stories,
    addStory: (story) => persist([{ ...story, id: `custom-${Date.now()}` }, ...stories]),
    removeStory: (id) => persist(stories.filter((s) => s.id !== id)),
  };

  return <CustomStoriesContext.Provider value={value}>{children}</CustomStoriesContext.Provider>;
}

export function useCustomStories(): CustomStoriesContextValue {
  const ctx = useContext(CustomStoriesContext);
  if (!ctx) throw new Error('useCustomStories must be used within CustomStoriesProvider');
  return ctx;
}
