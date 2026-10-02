import type { WordFamily } from '@phonicspal/core';
import { expoSpeechEngine } from '@phonicspal/speech';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './ThemedText';
import { colors, radii, sectionColors, spacing, withAlpha } from './tokens';
import { useScheme } from './useScheme';

export interface PhonicsFamilyCardProps {
  family: WordFamily;
  // Shown as a small 📖 button per word, separate from the tile's own
  // speak tap — opens the shared word-lookup sheet (apps/app's phonics
  // screen). Omitted call sites just don't get a lookup affordance.
  onWordPress?: (word: string) => void;
}

// Renders one 'family'-view rime (Word Families): the ending stays fixed,
// tap any onset letter to swap it in and hear the real word it makes —
// cat, hat, bat, … — the same "change the first letter" interaction the
// topic's own intro describes.
export function PhonicsFamilyCard({ family, onWordPress }: PhonicsFamilyCardProps) {
  const scheme = useScheme();
  const accent = sectionColors.phonics;

  function speak(word: string) {
    expoSpeechEngine.stop();
    expoSpeechEngine.say(word, { rate: 0.8 });
  }

  return (
    <View style={[styles.card, { backgroundColor: colors[scheme].background }]}>
      <View style={[styles.rimeBadge, { backgroundColor: withAlpha(accent, 0.14) }]}>
        <ThemedText variant="title" style={{ color: accent }}>
          -{family.rime}
        </ThemedText>
      </View>
      <View style={styles.onsets}>
        {family.onsets.map((o) => (
          <Pressable
            key={o.letter}
            onPress={() => speak(o.word)}
            accessibilityRole="button"
            style={[styles.onsetTile, { borderColor: colors[scheme].border }]}
          >
            <ThemedText variant="subtitle" style={{ color: accent }}>
              {o.letter}
            </ThemedText>
            <ThemedText variant="body" color="labelSecondary">
              {o.word}
            </ThemedText>
            {onWordPress ? (
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  onWordPress(o.word);
                }}
                accessibilityLabel={`Look up "${o.word}"`}
              >
                <ThemedText variant="label">📖</ThemedText>
              </Pressable>
            ) : null}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    padding: spacing.md,
    gap: spacing.sm,
  },
  rimeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
  },
  onsets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  onsetTile: {
    minWidth: 64,
    borderWidth: 2,
    borderRadius: radii.lg,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    gap: 2,
  },
});
