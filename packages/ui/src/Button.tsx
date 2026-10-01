import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, type GestureResponderEvent } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { ThemedText } from './ThemedText';
import { darken, minTouchTarget, radii, sectionColors, spacing, type SectionId } from './tokens';

export interface ButtonProps {
  title: string;
  onPress: (e: GestureResponderEvent) => void;
  variant?: 'primary' | 'secondary';
  accent?: SectionId;
  disabled?: boolean;
  loading?: boolean;
}

const PRESS_DEPTH = 6;

// A chunky "3D" button: a darker lip sits behind the face, and the face
// slides down into it on press — the physical-feeling tap kids' apps
// (Duolingo, etc.) use instead of a flat opacity change.
export function Button({
  title,
  onPress,
  variant = 'primary',
  accent = 'phonics',
  disabled,
  loading,
}: ButtonProps) {
  const color = sectionColors[accent];
  const lip = darken(color, 0.22);
  const isDisabled = disabled || loading;
  const [pressed, setPressed] = useState(false);

  const faceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(pressed ? PRESS_DEPTH : 0, { duration: 80 }) }],
  }));

  if (variant === 'secondary') {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        style={({ pressed: p }) => [
          styles.secondary,
          { borderColor: color, opacity: isDisabled ? 0.5 : p ? 0.7 : 1 },
        ]}
      >
        <ThemedText variant="subtitle" style={{ color }}>
          {title}
        </ThemedText>
      </Pressable>
    );
  }

  return (
    <View style={[styles.wrap, { opacity: isDisabled ? 0.5 : 1 }]}>
      <View style={[styles.lip, { backgroundColor: lip }]} />
      <Pressable
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
      >
        <Animated.View style={[styles.face, { backgroundColor: color }, faceStyle]}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <ThemedText variant="subtitle" style={styles.label}>
              {title}
            </ThemedText>
          )}
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  lip: {
    position: 'absolute',
    top: PRESS_DEPTH,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radii.pill,
  },
  face: {
    minHeight: minTouchTarget,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  label: {
    color: '#FFFFFF',
  },
  secondary: {
    minHeight: minTouchTarget,
    borderRadius: radii.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
});
