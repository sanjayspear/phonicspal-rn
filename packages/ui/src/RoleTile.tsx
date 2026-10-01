import type { Role } from '@phonicspal/core';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './ThemedText';
import { colors, minTouchTarget, radii, sectionColors, spacing } from './tokens';
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
          backgroundColor: selected ? `${accent}14` : colors[scheme].surface,
        },
      ]}
    >
      <View style={styles.iconSlot}>{icon}</View>
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
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    gap: spacing.xs,
  },
  iconSlot: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    textAlign: 'center',
  },
});
