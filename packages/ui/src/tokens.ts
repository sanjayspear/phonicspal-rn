// Design tokens — see PHONICSPAL_RN_DESIGN_DOC.md §2.2.
// Section accents are picked from a 700/800-weight palette so they clear
// WCAG AA (4.5:1) as text/icon color on a white background — verify with
// a contrast checker before changing any of these.

export type SectionId = 'home' | 'phonics' | 'read' | 'books' | 'vocab';

export const sectionColors: Record<SectionId, string> = {
  home: '#2D6A4F', // ~6.8:1 on white
  phonics: '#1D4ED8', // ~7.0:1 on white
  read: '#9D174D', // ~6.9:1 on white
  books: '#92400E', // ~6.5:1 on white
  vocab: '#5B21B6', // ~8.2:1 on white
};

export const colors = {
  light: {
    background: '#FFFFFF',
    surface: '#F7F7F9',
    label: '#111111',
    labelSecondary: '#55565C',
    border: '#E3E3E8',
  },
  dark: {
    background: '#0B0B0C',
    surface: '#1C1C1F',
    label: '#F5F5F7',
    labelSecondary: '#B7B8BE',
    border: '#2E2E33',
  },
};

// Fixed breakpoints, not fluid-only scaling — see §2.2 recommendation.
export const breakpoints = {
  phone: 0,
  tablet: 600,
  desktop: 1024,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radii = {
  sm: 8,
  md: 16,
  lg: 24,
  pill: 999,
};

// Minimum comfortable touch target for a 4-5 year old (well above the
// usual 44px adult minimum).
export const minTouchTarget = 56;
