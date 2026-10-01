import type { PhonicsCard } from '@phonicspal/core';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './ThemedText';
import { colors, radii, sectionColors, spacing, withAlpha } from './tokens';
import { useScheme } from './useScheme';

export interface PhonicsCardTileProps {
  card: PhonicsCard;
  selected: boolean;
  onPress: () => void;
}

// Renders one card of a v1 'cards'-view phonics topic (Short Vowels, Long
// Vowels, Consonant Sounds, …) — tap to focus it and reveal its example
// words/hint. No audio yet (see packages/core/src/topics.ts header).
export function PhonicsCardTile({ card, selected, onPress }: PhonicsCardTileProps) {
  const scheme = useScheme();
  const accent = sectionColors.phonics;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={[
        styles.tile,
        {
          backgroundColor: selected ? withAlpha(accent, 0.1) : colors[scheme].background,
          borderColor: selected ? accent : colors[scheme].border,
        },
      ]}
    >
      {card.tag ? (
        <View style={[styles.tag, { backgroundColor: withAlpha(accent, 0.14) }]}>
          <ThemedText variant="label" style={{ color: accent }}>
            {card.tag}
          </ThemedText>
        </View>
      ) : null}

      <ThemedText variant="title" style={{ color: selected ? accent : colors[scheme].label }}>
        {card.symbol}
      </ThemedText>

      {selected ? (
        <View style={styles.details}>
          <ThemedText variant="body" color="labelSecondary" style={styles.words}>
            {card.exampleWords.join(' · ')}
          </ThemedText>
          {card.hint ? (
            <ThemedText variant="body" color="labelSecondary" style={styles.hint}>
              {card.hint}
            </ThemedText>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 140,
    minHeight: 100,
    borderRadius: radii.lg,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    gap: spacing.xs,
  },
  tag: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.pill,
  },
  details: {
    gap: spacing.xs,
  },
  words: {
    textAlign: 'center',
  },
  hint: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
