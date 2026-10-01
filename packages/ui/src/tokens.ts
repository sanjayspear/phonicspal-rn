// Design tokens — see PHONICSPAL_RN_DESIGN_DOC.md §2.2.
// Section accents are picked from a 700/800-weight palette so they clear
// WCAG AA (4.5:1) both as text-on-white AND as white-text-on-fill (the
// ratio is symmetric), which is why the same values are reused for solid
// button/badge fills, not just text/icons — verify with a contrast
// checker before changing any of these.

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
  xl: 28,
  pill: 999,
};

// Minimum comfortable touch target for a 4-5 year old (well above the
// usual 44px adult minimum).
export const minTouchTarget = 56;

// Playful & bright direction: Baloo 2 (rounded display font) for anything
// a child reads as a heading/label, keeping a plain system font for dense
// body copy. Family name strings must match the keys loaded via
// @expo-google-fonts/baloo-2 in the app's root layout.
export const fonts = {
  heading: 'Baloo2_800ExtraBold',
  subheading: 'Baloo2_700Bold',
  label: 'Baloo2_600SemiBold',
};

// Darken a #RRGGBB color by `amount` (0-1) — used for the 3D "press" lip
// under buttons/cards (a flat bottom shadow layer, not a blurred shadow).
export function darken(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 0xff) * (1 - amount));
  const g = Math.round(((n >> 8) & 0xff) * (1 - amount));
  const b = Math.round((n & 0xff) * (1 - amount));
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

// Append an alpha channel (0-1) to a #RRGGBB color for a light tint wash.
export function withAlpha(hex: string, alpha: number): string {
  return `${hex}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
}
