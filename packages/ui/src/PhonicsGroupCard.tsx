import type { PhonicsGroup } from '@phonicspal/core';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from './ThemedText';
import { colors, radii, sectionColors, spacing, withAlpha } from './tokens';
import { useScheme } from './useScheme';

export interface PhonicsGroupCardProps {
  group: PhonicsGroup;
}

// Renders one category of a v1 'groups'-view phonics topic (Rhyming,
// Hard/Soft C, Syllable Types, …): a big label, a short rule, and the
// example words. No tap-to-select state like PhonicsCardTile — groups
// topics show every category's words at once (matches v1).
export function PhonicsGroupCard({ group }: PhonicsGroupCardProps) {
  const scheme = useScheme();
  const accent = sectionColors.phonics;

  return (
    <View style={[styles.card, { backgroundColor: colors[scheme].background }]}>
      <View style={[styles.badge, { backgroundColor: withAlpha(accent, 0.14) }]}>
        <ThemedText variant="subtitle" style={{ color: accent }}>
          {group.big}
        </ThemedText>
      </View>
      <View style={styles.text}>
        <ThemedText variant="subtitle">{group.title}</ThemedText>
        {group.sub ? (
          <ThemedText variant="body" color="labelSecondary">
            {group.sub}
          </ThemedText>
        ) : null}
        <ThemedText variant="body" style={{ color: accent }}>
          {group.words.join(' · ')}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    borderRadius: radii.xl,
    padding: spacing.md,
  },
  badge: {
    minWidth: 64,
    minHeight: 64,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  text: {
    flex: 1,
    gap: spacing.xs,
  },
});
