import { mockActivity, type ActivityEvent } from '@phonicspal/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// Local-only activity feed, seeded from mockActivity. A parent submitting a
// Learning Path step (see parent-dashboard.tsx) pushes a real event here,
// so the Teacher dashboard's "Recent activity" stops being frozen mock
// data — same local-only caveat as useLearningPaths (same device only).
const STORAGE_KEY = 'phonicspal.activity';

interface ActivityContextValue {
  loading: boolean;
  events: ActivityEvent[];
  addEvent: (event: Omit<ActivityEvent, 'id'>) => void;
}

const ActivityContext = createContext<ActivityContextValue | null>(null);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<ActivityEvent[]>(mockActivity);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setEvents(JSON.parse(raw) as ActivityEvent[]);
      })
      .finally(() => setLoading(false));
  }, []);

  function persist(next: ActivityEvent[]) {
    setEvents(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  const value: ActivityContextValue = {
    loading,
    events,
    addEvent: (event) => persist([{ ...event, id: `${Date.now()}` }, ...events]),
  };

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}

export function useActivity(): ActivityContextValue {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error('useActivity must be used within ActivityProvider');
  return ctx;
}
