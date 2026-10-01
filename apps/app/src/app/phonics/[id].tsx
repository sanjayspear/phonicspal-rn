import { getPhonicsTopic } from '@phonicspal/core';
import {
  PhonicsCardTile,
  ThemedText,
  colors,
  radii,
  sectionColors,
  spacing,
  useScheme,
  withAlpha,
} from '@phonicspal/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';

export default function PhonicsTopicScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scheme = useScheme();
  const topic = getPhonicsTopic(id);
  const [selected, setSelected] = useState<string | null>(null);

  if (!topic) {
    return (
      <View style={styles.root}>
        <SafeAreaView style={styles.flex} edges={['top']}>
          <View style={styles.content}>
            <ScreenHeader title="Not found" />
            <ThemedText variant="body" color="labelSecondary">
              That topic isn't ported yet.
            </ThemedText>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[withAlpha(sectionColors.phonics, 0.16), colors[scheme].background]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <ScreenHeader title={`${topic.icon} ${topic.name}`} />
          <ThemedText variant="body" color="labelSecondary">
            {topic.intro}
          </ThemedText>

          <View style={[styles.tipBox, { backgroundColor: withAlpha(sectionColors.phonics, 0.1) }]}>
            <ThemedText variant="body" style={{ color: sectionColors.phonics }}>
              🦉 {topic.tip}
            </ThemedText>
          </View>

          <View style={styles.grid}>
            {topic.cards.map((card) => (
              <PhonicsCardTile
                key={card.symbol}
                card={card}
                selected={selected === card.symbol}
                onPress={() => setSelected((s) => (s === card.symbol ? null : card.symbol))}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  tipBox: {
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
