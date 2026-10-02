import { expoSpeechEngine } from '@phonicspal/speech';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './ThemedText';
import { colors, radii, sectionColors, spacing, withAlpha } from './tokens';
import { useScheme } from './useScheme';

export interface PhonicsWordTileProps {
  // A hyphen-joined sound sequence, e.g. 'c-a-t' or 'sh-i-p'.
  word: string;
  blended: boolean;
  onPress: () => void;
  // Shown as a small 📖 button once blended, separate from the tile's own
  // blend/speak tap — opens the shared word-lookup sheet (apps/app's
  // phonics screen). Omitted call sites just don't get a lookup affordance.
  onWordPress?: (word: string) => void;
}

// Renders one word of a v1 'words'-view topic (CVC Words, Blending, …):
// starts segmented into its sounds (c · a · t), tap to blend them into the
// whole word, and say it aloud — the same segment-then-blend interaction
// v1's words view uses, via the shared TTS engine (see
// packages/core/src/topics.ts header for what that does/doesn't cover).
export function PhonicsWordTile({ word, blended, onPress, onWordPress }: PhonicsWordTileProps) {
  const scheme = useScheme();
  const accent = sectionColors.phonics;
  const segments = word.split('-');
  const wholeWord = segments.join('');

  useEffect(() => {
    if (!blended) return;
    expoSpeechEngine.stop();
    expoSpeechEngine.say(segments.join(''), { rate: 0.8 });
  }, [blended, word]);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={[
        styles.tile,
        {
          backgroundColor: blended ? withAlpha(accent, 0.1) : colors[scheme].background,
          borderColor: blended ? accent : colors[scheme].border,
        },
      ]}
    >
      {blended ? (
        <View style={styles.blendedRow}>
          <ThemedText variant="title" style={{ color: accent }}>
            {wholeWord}
          </ThemedText>
          {onWordPress ? (
            // No accessibilityRole here: the outer tile already renders as
            // a <button> on web, and nesting another is invalid HTML.
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onWordPress(wholeWord);
              }}
              accessibilityLabel={`Look up "${wholeWord}"`}
            >
              <ThemedText variant="subtitle">📖</ThemedText>
            </Pressable>
          ) : null}
        </View>
      ) : (
        <View style={styles.segments}>
          {segments.map((s, i) => (
            <View key={i} style={[styles.segment, { backgroundColor: withAlpha(accent, 0.1) }]}>
              <ThemedText variant="subtitle" style={{ color: accent }}>
                {s}
              </ThemedText>
            </View>
          ))}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    minWidth: 120,
    minHeight: 72,
    borderRadius: radii.lg,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  },
  segments: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  blendedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  segment: {
    minWidth: 32,
    minHeight: 40,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
});
