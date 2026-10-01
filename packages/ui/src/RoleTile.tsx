import type { Role } from '@phonicspal/core';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './ThemedText';
import { colors, minTouchTarget, radii, sectionColors, spacing, withAlpha } from './tokens';
import { useScheme } from './useScheme';

// Not tied to a phonics SectionId (roles aren't content sections), so this
// gets its own small accent map rather than reusing sectionColors.
const roleAccent: Record<Role, string> = {
  teacher: sectionColors.phonics,
  parent: sectionColors.home,
  solo: sectionColors.vocab,
};

export interface RoleTileProps {
  role: Role;
  title: string;
  description: string;
  icon?: React.ReactNode;
  selected: boolean;
  onPress: () => void;
}

export function RoleTile({ role, title, description, icon, selected, onPress }: RoleTileProps) {
  const scheme = useScheme();
  const accent = roleAccent[role];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={[
        styles.tile,
        {
          borderColor: selected ? accent : colors[scheme].border,
          backgroundColor: selected ? withAlpha(accent, 0.08) : colors[scheme].background,
        },
        selected && {
          shadowColor: accent,
          ...Platform.select({
            web: { boxShadow: `0 8px 20px -6px ${withAlpha(accent, 0.45)}` },
            default: { shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 3 },
          }),
        },
      ]}
    >
      {selected ? (
        <View style={[styles.check, { backgroundColor: accent }]}>
          <ThemedText style={styles.checkMark}>✓</ThemedText>
        </View>
      ) : null}
      <View style={[styles.badge, { backgroundColor: selected ? accent : withAlpha(accent, 0.12) }]}>
        {icon}
      </View>
      <ThemedText variant="subtitle" style={{ color: selected ? accent : colors[scheme].label }}>
        {title}
      </ThemedText>
      <ThemedText variant="body" color="labelSecondary" style={styles.description}>
        {description}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minHeight: minTouchTarget * 2,
    borderWidth: 2,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    gap: spacing.xs,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 22,
    height: 22,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  description: {
    textAlign: 'center',
  },
});
