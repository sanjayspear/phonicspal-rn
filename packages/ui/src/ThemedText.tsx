import { StyleSheet, Text, type TextProps } from 'react-native';

import { colors } from './tokens';
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
      return { phone: 28, tablet: 34, desktop: 40 };
    case 'subtitle':
      return { phone: 20, tablet: 24 };
    case 'label':
      return { phone: 14, tablet: 15 };
    case 'body':
    default:
      return { phone: 17, tablet: 18 };
  }
}

const styles = StyleSheet.create({
  title: { fontWeight: '700' },
  subtitle: { fontWeight: '600' },
  body: { fontWeight: '400' },
  label: { fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
});
