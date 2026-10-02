import type { ClapWord } from '@phonicspal/core';
import { expoSpeechEngine } from '@phonicspal/speech';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './ThemedText';
import { colors, radii, sectionColors, spacing, withAlpha } from './tokens';
import { useScheme } from './useScheme';

export interface PhonicsClapCardProps {
  entry: ClapWord;
}

// Renders one 'clap'-view word (Syllables, Multisyllabic Words): tap
// "Clap it out" to hear each syllable chunk spoken one at a time, with the
// chunk being read highlighted as it's spoken, then the whole word said
// together — the "read one chunk at a time" interaction both clap topics'
// intros describe.
export function PhonicsClapCard({ entry }: PhonicsClapCardProps) {
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
      <ThemedText variant="body" color="labelSecondary">
        👏 {clapping ? 'Clapping…' : 'Tap to clap it out'}
      </ThemedText>
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
});
