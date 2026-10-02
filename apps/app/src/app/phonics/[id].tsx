import { getPhonicsTopic } from '@phonicspal/core';
import { expoSpeechEngine } from '@phonicspal/speech';
import {
  PhonicsCardTile,
  PhonicsGroupCard,
  PhonicsWordTile,
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
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';

export default function PhonicsTopicScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scheme = useScheme();
  const topic = getPhonicsTopic(id);
  const [selected, setSelected] = useState<string | null>(null);
  const [blended, setBlended] = useState<Set<string>>(new Set());

  useEffect(() => () => expoSpeechEngine.stop(), []);

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

          {topic.view === 'cards' ? (
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
          ) : topic.view === 'groups' ? (
            <View style={styles.stack}>
              {topic.groups.map((group, i) => (
                <PhonicsGroupCard key={i} group={group} />
              ))}
            </View>
          ) : topic.view === 'words' ? (
            <View style={styles.grid}>
              {topic.words.map((word) => (
                <PhonicsWordTile
                  key={word}
                  word={word}
                  blended={blended.has(word)}
                  onPress={() =>
                    setBlended((prev) => {
                      const next = new Set(prev);
                      if (next.has(word)) next.delete(word);
                      else next.add(word);
                      return next;
                    })
                  }
                />
              ))}
            </View>
          ) : (
            <ThemedText variant="body" color="labelSecondary">
              The interactive practice for this topic isn{'’'}t built yet — the intro and tip
              above are the real content, same as v1.
            </ThemedText>
          )}
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
  stack: {
    gap: spacing.sm,
  },
});
