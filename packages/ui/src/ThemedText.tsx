import { StyleSheet, Text, type TextProps } from 'react-native';

import { colors, fonts } from './tokens';
import { useScaled } from './useBreakpoint';
import { useScheme } from './useScheme';

export type ThemedTextProps = TextProps & {
  variant?: 'title' | 'subtitle' | 'body' | 'label';
  color?: 'label' | 'labelSecondary';
};

export function ThemedText({ style, variant = 'body', color = 'label', ...rest }: ThemedTextProps) {
  const scheme = useScheme();
  const fontSize = useScaled(sizeFor(variant));

  return (
    <Text
      style={[{ color: colors[scheme][color], fontSize }, styles[variant], style]}
      {...rest}
    />
  );
}

function sizeFor(variant: NonNullable<ThemedTextProps['variant']>) {
  switch (variant) {
    case 'title':
      return { phone: 30, tablet: 36, desktop: 42 };
    case 'subtitle':
      return { phone: 20, tablet: 24 };
    case 'label':
      return { phone: 14, tablet: 15 };
    case 'body':
    default:
      return { phone: 17, tablet: 18 };
  }
}

// Baloo 2 (a rounded display font) for anything a child reads as a
// heading/label; body copy stays on the system font for density/legibility.
const styles = StyleSheet.create({
  title: { fontFamily: fonts.heading },
  subtitle: { fontFamily: fonts.subheading },
  body: { fontWeight: '400' },
  label: { fontFamily: fonts.label, textTransform: 'uppercase', letterSpacing: 0.6 },
});
