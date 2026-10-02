import type { PhonicsGroup } from '@phonicspal/core';
import { expoSpeechEngine } from '@phonicspal/speech';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './ThemedText';
import { colors, radii, sectionColors, spacing, withAlpha } from './tokens';
import { useScheme } from './useScheme';

export interface PhonicsGroupCardProps {
  group: PhonicsGroup;
}

// Renders one category of a v1 'groups'-view phonics topic (Rhyming,
// Hard/Soft C, Syllable Types, …): a big label, a short rule, and the
// example words — tap to hear the words read aloud via the shared TTS
// engine. No per-word selection like PhonicsCardTile — groups topics show
// every category's words at once (matches v1).
export function PhonicsGroupCard({ group }: PhonicsGroupCardProps) {
  const scheme = useScheme();
  const accent = sectionColors.phonics;

  return (
    <Pressable
      onPress={() => {
        expoSpeechEngine.stop();
        expoSpeechEngine.say(group.words.join(', '), { rate: 0.8 });
      }}
      accessibilityRole="button"
      style={[styles.card, { backgroundColor: colors[scheme].background }]}
    >
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
    </Pressable>
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
