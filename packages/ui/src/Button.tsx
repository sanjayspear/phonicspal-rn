import { ActivityIndicator, Pressable, StyleSheet, type GestureResponderEvent } from 'react-native';

import { ThemedText } from './ThemedText';
import { minTouchTarget, radii, sectionColors, spacing, type SectionId } from './tokens';

export interface ButtonProps {
  title: string;
  onPress: (e: GestureResponderEvent) => void;
  variant?: 'primary' | 'secondary';
  accent?: SectionId;
  disabled?: boolean;
  loading?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  accent = 'phonics',
  disabled,
  loading,
}: ButtonProps) {
  const color = sectionColors[accent];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary'
          ? { backgroundColor: color, opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1 }
          : {
              backgroundColor: 'transparent',
              borderWidth: 2,
              borderColor: color,
              opacity: isDisabled ? 0.5 : pressed ? 0.7 : 1,
            },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : color} />
      ) : (
        <ThemedText
          variant="subtitle"
          style={[styles.label, { color: variant === 'primary' ? '#FFFFFF' : color }]}
        >
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: minTouchTarget,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  label: {
    fontWeight: '700',
  },
});
