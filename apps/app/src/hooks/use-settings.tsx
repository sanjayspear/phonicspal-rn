import { setAccessibilityPrefs, type AccessibilityPrefs } from '@phonicspal/ui';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const SETTINGS_KEY = 'phonicspal.settings';

const DEFAULTS: AccessibilityPrefs = { highContrast: false, reduceMotion: false };

interface SettingsContextValue extends AccessibilityPrefs {
  loading: boolean;
  setHighContrast: (value: boolean) => void;
  setReduceMotion: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<AccessibilityPrefs>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY)
      .then((raw) => {
        const loaded = raw ? (JSON.parse(raw) as AccessibilityPrefs) : DEFAULTS;
        setPrefs(loaded);
        setAccessibilityPrefs(loaded);
      })
      .finally(() => setLoading(false));
  }, []);

  function update(next: Partial<AccessibilityPrefs>) {
    const merged = { ...prefs, ...next };
    setPrefs(merged);
    setAccessibilityPrefs(merged);
    AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
  }

  const value: SettingsContextValue = {
    ...prefs,
    loading,
    setHighContrast: (highContrast) => update({ highContrast }),
    setReduceMotion: (reduceMotion) => update({ reduceMotion }),
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
