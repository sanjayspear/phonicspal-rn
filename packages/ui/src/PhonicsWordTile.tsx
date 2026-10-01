import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './ThemedText';
import { colors, radii, sectionColors, spacing, withAlpha } from './tokens';
import { useScheme } from './useScheme';

export interface PhonicsWordTileProps {
  // A hyphen-joined sound sequence, e.g. 'c-a-t' or 'sh-i-p'.
  word: string;
  blended: boolean;
  onPress: () => void;
}

// Renders one word of a v1 'words'-view topic (CVC Words, Blending, …):
// starts segmented into its sounds (c · a · t), tap to blend them into the
// whole word — the same segment-then-blend interaction v1's words view
// uses, just without the audio (see packages/core/src/topics.ts header).
export function PhonicsWordTile({ word, blended, onPress }: PhonicsWordTileProps) {
  const scheme = useScheme();
  const accent = sectionColors.phonics;
  const segments = word.split('-');

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
        <ThemedText variant="title" style={{ color: accent }}>
          {segments.join('')}
        </ThemedText>
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
  segment: {
    minWidth: 32,
    minHeight: 40,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
});
