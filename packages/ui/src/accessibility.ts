import { useSyncExternalStore } from 'react';

// A tiny module-level store (not React Context) so any package/ui component
// can read current accessibility prefs without the app having to thread a
// provider through every component tree. The app (apps/app/src/hooks/
// use-settings.tsx) owns persistence and calls setAccessibilityPrefs
// whenever the user changes a setting or on initial load.
export interface AccessibilityPrefs {
  highContrast: boolean;
  reduceMotion: boolean;
}

let prefs: AccessibilityPrefs = { highContrast: false, reduceMotion: false };
const listeners = new Set<() => void>();

export function setAccessibilityPrefs(next: Partial<AccessibilityPrefs>) {
  prefs = { ...prefs, ...next };
  listeners.forEach((l) => l());
}

export function getAccessibilityPrefs(): AccessibilityPrefs {
  return prefs;
}

export function useAccessibilityPrefs(): AccessibilityPrefs {
  return useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
    () => prefs,
    () => prefs
  );
}
