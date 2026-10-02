import type { ClapWord } from '@phonicspal/core';
import { expoSpeechEngine } from '@phonicspal/speech';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './ThemedText';
import { colors, radii, sectionColors, spacing, withAlpha } from './tokens';
import { useScheme } from './useScheme';

export interface PhonicsClapCardProps {
  entry: ClapWord;
  // Shown as a small 📖 button next to the word, separate from the card's
  // own clap-it-out tap — opens the shared word-lookup sheet (apps/app's
  // phonics screen). Omitted call sites just don't get a lookup affordance.
  onWordPress?: (word: string) => void;
}

// Renders one 'clap'-view word (Syllables, Multisyllabic Words): tap
// "Clap it out" to hear each syllable chunk spoken one at a time, with the
// chunk being read highlighted as it's spoken, then the whole word said
// together — the "read one chunk at a time" interaction both clap topics'
// intros describe.
export function PhonicsClapCard({ entry, onWordPress }: PhonicsClapCardProps) {
  const scheme = useScheme();
  const accent = sectionColors.phonics;
  const [activeChunk, setActiveChunk] = useState<number | null>(null);
  const [clapping, setClapping] = useState(false);

  async function clapItOut() {
    if (clapping) return;
    setClapping(true);
    for (let i = 0; i < entry.syllables.length; i++) {
      setActiveChunk(i);
      expoSpeechEngine.stop();
      await expoSpeechEngine.say(entry.syllables[i], { rate: 0.6 });
    }
    setActiveChunk(null);
    expoSpeechEngine.stop();
    await expoSpeechEngine.say(entry.word, { rate: 0.8 });
    setClapping(false);
  }

  return (
    <Pressable
      onPress={clapItOut}
      accessibilityRole="button"
      style={[styles.card, { backgroundColor: colors[scheme].background }]}
    >
      <View style={styles.chunks}>
        {entry.syllables.map((s, i) => (
          <View
            key={i}
            style={[
              styles.chunk,
              { backgroundColor: i === activeChunk ? accent : withAlpha(accent, 0.1) },
            ]}
          >
            <ThemedText variant="subtitle" style={{ color: i === activeChunk ? '#FFFFFF' : accent }}>
              {s}
            </ThemedText>
          </View>
        ))}
      </View>
      <View style={styles.caption}>
        <ThemedText variant="body" color="labelSecondary">
          👏 {clapping ? 'Clapping…' : 'Tap to clap it out'}
        </ThemedText>
        {onWordPress ? (
          // No accessibilityRole here: the outer card already renders as a
          // <button> on web, and nesting another is invalid HTML.
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onWordPress(entry.word);
            }}
            accessibilityLabel={`Look up "${entry.word}"`}
          >
            <ThemedText variant="label">📖</ThemedText>
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
    minWidth: 140,
  },
  chunks: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  chunk: {
    borderRadius: radii.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  caption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});
