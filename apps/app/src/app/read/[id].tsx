import { getStory } from '@phonicspal/core';
import {
  Button,
  ThemedText,
  colors,
  radii,
  sectionColors,
  spacing,
  useScheme,
  withAlpha,
} from '@phonicspal/ui';
import { expoSpeechEngine } from '@phonicspal/speech';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';

interface Token {
  text: string;
  start: number;
  end: number;
}

function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  const re = /\S+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    tokens.push({ text: m[0], start: m.index, end: m.index + m[0].length });
  }
  return tokens;
}

export default function ReadStoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scheme = useScheme();
  const story = getStory(id);
  const fullText = useMemo(() => story?.lines.join(' ') ?? '', [story]);
  const tokens = useMemo(() => tokenize(fullText), [fullText]);

  const [playing, setPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => () => expoSpeechEngine.stop(), []);

  async function play() {
    setPlaying(true);
    setActiveIndex(null);
    await expoSpeechEngine.say(fullText, {
      rate: 0.8,
      onBoundary: (e) => {
        const idx = tokens.findIndex((t) => e.charIndex >= t.start && e.charIndex < t.end);
        if (idx !== -1) setActiveIndex(idx);
      },
    });
    setPlaying(false);
    setActiveIndex(null);
  }

  function stop() {
    expoSpeechEngine.stop();
    setPlaying(false);
    setActiveIndex(null);
  }

  if (!story) {
    return (
      <View style={styles.root}>
        <SafeAreaView style={styles.flex} edges={['top']}>
          <View style={styles.content}>
            <ScreenHeader title="Not found" />
            <ThemedText variant="body" color="labelSecondary">
              That story isn't ported yet.
            </ThemedText>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[withAlpha(sectionColors.read, 0.16), colors[scheme].background]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <ScreenHeader title={`${story.icon} ${story.title}`} />

          <View style={[styles.storyCard, { backgroundColor: colors[scheme].background }]}>
            <Text style={styles.storyText}>
              {tokens.map((t, i) => (
                <Text
                  key={i}
                  style={[
                    styles.word,
                    i === activeIndex && {
                      backgroundColor: withAlpha(sectionColors.read, 0.25),
                      color: sectionColors.read,
                    },
                  ]}
                >
                  {t.text}{' '}
                </Text>
              ))}
            </Text>
          </View>

          {playing ? (
            <Button title="⏹ Stop" variant="secondary" accent="read" onPress={stop} />
          ) : (
            <Button title="▶ Listen" accent="read" onPress={play} />
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
    maxWidth: 700,
    alignSelf: 'center',
    width: '100%',
  },
  storyCard: {
    borderRadius: radii.xl,
    padding: spacing.lg,
  },
  storyText: {
    fontSize: 22,
    lineHeight: 36,
  },
  word: {
    borderRadius: radii.sm,
  },
});
