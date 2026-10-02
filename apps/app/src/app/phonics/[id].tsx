import { getNodeTitle, getPhonicsTopic, mockChildName } from '@phonicspal/core';
import { expoSpeechEngine } from '@phonicspal/speech';
import {
  Button,
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
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { useActivity } from '@/hooks/use-activity';
import { useLearningPaths } from '@/hooks/use-learning-paths';

export default function PhonicsTopicScreen() {
  const { id, pathNodeId, studentId } = useLocalSearchParams<{
    id: string;
    pathNodeId?: string;
    studentId?: string;
  }>();
  const scheme = useScheme();
  const topic = getPhonicsTopic(id);
  const [selected, setSelected] = useState<string | null>(null);
  const [blended, setBlended] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  const { getPath, submitNode } = useLearningPaths();
  const { addEvent } = useActivity();
  // Set only when this screen was deep-linked from the parent dashboard's
  // "Continue" button (docs/DESIGN.md §4.3's "guided mode") — browsing
  // Phonics freely never passes these params, so the banner/Submit button
  // below only shows up for an actual Learning Path task.
  const guidedNode =
    pathNodeId && studentId ? getPath(studentId)?.nodes.find((n) => n.id === pathNodeId) : undefined;

  useEffect(() => () => expoSpeechEngine.stop(), []);

  async function handleSubmit() {
    if (!guidedNode || !studentId) return;
    setSubmitting(true);
    await submitNode(studentId, guidedNode.id);
    addEvent({ studentName: mockChildName, summary: `Submitted ${getNodeTitle(guidedNode)}`, whenLabel: 'Just now' });
    setSubmitting(false);
    router.back();
  }

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

          {guidedNode ? (
            <View style={[styles.guidedBox, { backgroundColor: withAlpha(sectionColors.home, 0.1) }]}>
              {guidedNode.status === 'submitted' ? (
                <ThemedText variant="body" style={{ color: sectionColors.home }}>
                  ✅ Already submitted — great work!
                </ThemedText>
              ) : (
                <>
                  <ThemedText variant="body" style={{ color: sectionColors.home }}>
                    🏠 Today's Learning Path task — practice together, then mark it done.
                  </ThemedText>
                  <Button
                    title="Mark this done"
                    accent="home"
                    onPress={handleSubmit}
                    loading={submitting}
                  />
                </>
              )}
            </View>
          ) : null}
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
  guidedBox: {
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.sm,
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
