import type { PhonicsCard } from '@phonicspal/core';
import { expoSpeechEngine } from '@phonicspal/speech';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ThemedText } from './ThemedText';
import { colors, radii, sectionColors, spacing, withAlpha } from './tokens';
import { useScheme } from './useScheme';

export interface PhonicsCardTileProps {
  card: PhonicsCard;
  selected: boolean;
  onPress: () => void;
  // Tap target per example word, separate from the card's own select/speak
  // tap — opens the shared word-lookup sheet (apps/app's phonics screen).
  // Omitted call sites just don't get a lookup affordance.
  onWordPress?: (word: string) => void;
}

// Renders one card of a v1 'cards'-view phonics topic (Short Vowels, Long
// Vowels, Consonant Sounds, …) — tap to focus it, reveal its example
// words/hint, and hear it spoken via the shared TTS engine (the same
// generic voice Read/Books use — no pre-rendered sound clips, see
// packages/core/src/topics.ts header).
export function PhonicsCardTile({ card, selected, onPress, onWordPress }: PhonicsCardTileProps) {
  const scheme = useScheme();
  const accent = sectionColors.phonics;

  useEffect(() => {
    if (!selected) return;
    expoSpeechEngine.stop();
    // Speak card.sound, not card.symbol: a plain TTS engine reads an
    // isolated letter as its alphabet name ('b' -> "bee"), not the phonic
    // sound this card teaches — see PhonicsCard['sound'] in types.ts.
    expoSpeechEngine.say(
      [card.sound ?? card.symbol, card.exampleWords[0]].filter(Boolean).join('. '),
      { rate: 0.8 }
    );
  }, [selected, card]);

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
          <View style={styles.wordRow}>
            {card.exampleWords.map((w, i) => (
              <Pressable
                key={w}
                disabled={!onWordPress}
                onPress={(e) => {
                  e.stopPropagation();
                  onWordPress?.(w);
                }}
              >
                <Text>
                  <ThemedText
                    variant="body"
                    color="labelSecondary"
                    style={onWordPress && styles.wordLink}
                  >
                    {w}
                  </ThemedText>
                  {i < card.exampleWords.length - 1 ? (
                    <ThemedText variant="body" color="labelSecondary">
                      {' · '}
                    </ThemedText>
                  ) : null}
                </Text>
              </Pressable>
            ))}
          </View>
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
  wordRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  wordLink: {
    textDecorationLine: 'underline',
  },
  hint: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
