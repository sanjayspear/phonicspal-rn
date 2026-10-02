import type { ChildIdentity } from '@phonicspal/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// The broadcast Learning Path model has no pre-existing roster the parent
// picks from — before starting or submitting any homework, they fill this
// in once (docs/DESIGN.md §4's CR-3), and it's what lets their progress
// show up on the teacher's side with a real name attached. Stored once per
// device, same local-only-family assumption as every other hook here.
const STORAGE_KEY = 'phonicspal.childIdentity';

interface ChildIdentityContextValue {
  loading: boolean;
  identity: ChildIdentity | null;
  saveIdentity: (identity: ChildIdentity) => Promise<void>;
  clearIdentity: () => Promise<void>;
}

const ChildIdentityContext = createContext<ChildIdentityContextValue | null>(null);

export function ChildIdentityProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<ChildIdentity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => setIdentity(raw ? (JSON.parse(raw) as ChildIdentity) : null))
      .finally(() => setLoading(false));
  }, []);

  async function saveIdentity(next: ChildIdentity) {
    setIdentity(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  async function clearIdentity() {
    setIdentity(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }

  const value: ChildIdentityContextValue = { loading, identity, saveIdentity, clearIdentity };

  return <ChildIdentityContext.Provider value={value}>{children}</ChildIdentityContext.Provider>;
}

export function useChildIdentity(): ChildIdentityContextValue {
  const ctx = useContext(ChildIdentityContext);
  if (!ctx) throw new Error('useChildIdentity must be used within ChildIdentityProvider');
  return ctx;
}
