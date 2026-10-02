import type { SightWordEntry } from '@phonicspal/core';
import { expoSpeechEngine } from '@phonicspal/speech';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radii, sectionColors, spacing } from './tokens';
import { useScheme } from './useScheme';

export interface PhonicsSightCardProps {
  entry: SightWordEntry;
}

// Renders one 'sight'-view word (Irregular & High-Frequency Words): tap to
// hear it, with the span that doesn't follow regular phonics rules
// (entry.trickyStart..trickyEnd) colored separately, matching the topic's
// own "the highlighted part does not follow the usual rules" intro.
export function PhonicsSightCard({ entry }: PhonicsSightCardProps) {
  const scheme = useScheme();
  const accent = sectionColors.phonics;
  const { word, trickyStart, trickyEnd } = entry;

  return (
    <Pressable
      onPress={() => {
        expoSpeechEngine.stop();
        expoSpeechEngine.say(word, { rate: 0.8 });
      }}
      accessibilityRole="button"
      style={[styles.tile, { backgroundColor: colors[scheme].background, borderColor: colors[scheme].border }]}
    >
      <Text style={styles.word}>
        <Text style={{ color: colors[scheme].label }}>{word.slice(0, trickyStart)}</Text>
        <Text style={{ color: accent, textDecorationLine: 'underline' }}>
          {word.slice(trickyStart, trickyEnd)}
        </Text>
        <Text style={{ color: colors[scheme].label }}>{word.slice(trickyEnd)}</Text>
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    minWidth: 100,
    minHeight: 72,
    borderWidth: 2,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  },
  word: {
    fontSize: 24,
    fontWeight: '700',
  },
});
