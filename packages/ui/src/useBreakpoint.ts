import { useWindowDimensions } from 'react-native';

import { breakpoints } from './tokens';

export type Breakpoint = keyof typeof breakpoints;

export function useBreakpoint(): Breakpoint {
  const { width } = useWindowDimensions();
  if (width >= breakpoints.desktop) return 'desktop';
  if (width >= breakpoints.tablet) return 'tablet';
  return 'phone';
}

// Bounded, breakpoint-driven sizing — the RN equivalent of CSS clamp(),
// per §2.2: pick from a fixed set of values instead of interpolating
// fluidly, so sizing can't run away on an unusual viewport.
export function useScaled(sizes: { phone: number; tablet?: number; desktop?: number }): number {
  const bp = useBreakpoint();
  if (bp === 'desktop') return sizes.desktop ?? sizes.tablet ?? sizes.phone;
  if (bp === 'tablet') return sizes.tablet ?? sizes.phone;
  return sizes.phone;
}
