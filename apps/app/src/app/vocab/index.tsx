import { starterDictionary, type DictionaryWord } from '@phonicspal/core';
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
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { useVocabulary } from '@/hooks/use-vocabulary';

type Tab = 'all' | 'saved' | 'starter' | 'practice';
const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'All Words' },
  { id: 'saved', label: 'Saved by Me' },
  { id: 'starter', label: 'Starter List' },
  { id: 'practice', label: 'Practice' },
];

export default function VocabScreen() {
  const scheme = useScheme();
  const { savedWords } = useVocabulary();
  const [tab, setTab] = useState<Tab>('all');

  const allWords = useMemo(
    () => [...savedWords, ...starterDictionary.filter((d) => !savedWords.some((s) => s.w === d.w))],
    [savedWords]
  );

  const listed = tab === 'saved' ? savedWords : tab === 'starter' ? starterDictionary : allWords;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[withAlpha(sectionColors.vocab, 0.16), colors[scheme].background]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <ScreenHeader title="Vocab" />

          <View style={styles.tabRow}>
            {TABS.map((t) => {
              const active = t.id === tab;
              return (
                <Pressable
                  key={t.id}
                  onPress={() => setTab(t.id)}
                  style={[
                    styles.tab,
                    {
                      backgroundColor: active ? sectionColors.vocab : withAlpha(sectionColors.vocab, 0.1),
                    },
                  ]}
                >
                  <ThemedText variant="label" style={{ color: active ? '#FFFFFF' : sectionColors.vocab }}>
                    {t.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          {tab === 'practice' ? (
            <Quiz pool={allWords} />
          ) : listed.length === 0 ? (
            <ThemedText variant="body" color="labelSecondary">
              No saved words yet. Save a word from the starter list to see it here.
            </ThemedText>
          ) : (
            <View style={styles.list}>
              {listed.map((word) => (
                <WordCard key={word.w} word={word} />
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function WordCard({ word }: { word: DictionaryWord }) {
  const scheme = useScheme();
  const { isSaved, saveWord, removeWord } = useVocabulary();
  const saved = isSaved(word.w);

  return (
    <View style={[styles.card, { backgroundColor: colors[scheme].background }]}>
      <View style={styles.cardTopRow}>
        <ThemedText variant="subtitle">{word.w}</ThemedText>
        <Pressable
          onPress={() => (saved ? removeWord(word.w) : saveWord(word))}
          style={[
            styles.saveChip,
            { backgroundColor: saved ? withAlpha(sectionColors.vocab, 0.12) : sectionColors.vocab },
          ]}
        >
          <ThemedText variant="label" style={{ color: saved ? sectionColors.vocab : '#FFFFFF' }}>
            {saved ? '✓ Saved' : '+ Save'}
          </ThemedText>
        </Pressable>
      </View>
      <ThemedText variant="body" color="labelSecondary" style={styles.pos}>
        {word.p}
      </ThemedText>
      <ThemedText variant="body">{word.m}</ThemedText>
      <ThemedText variant="body" color="labelSecondary" style={styles.example}>
        “{word.e}”
      </ThemedText>
    </View>
  );
}

function Quiz({ pool }: { pool: DictionaryWord[] }) {
  const scheme = useScheme();
  // makeQuestion is random (impure), so it's modeled as explicit state set
  // on each new round — not a useMemo derivation — since useMemo assumes a
  // pure function of its deps and a bump-a-counter-to-invalidate pattern is
  // exactly the kind of thing React Compiler's memoization can misfire on.
  const [{ question, options }, setQuizState] = useState(() => makeQuestion(pool));
  const [answer, setAnswer] = useState<DictionaryWord | null>(null);

  if (pool.length < 3) {
    return (
      <ThemedText variant="body" color="labelSecondary">
        Save a few more words to unlock Practice (needs at least 3).
      </ThemedText>
    );
  }

  const correct = answer === question;

  return (
    <View style={[styles.card, { backgroundColor: colors[scheme].background }]}>
      <ThemedText variant="subtitle">Which word means:</ThemedText>
      <ThemedText variant="body">“{question.m}”</ThemedText>

      <View style={styles.optionRow}>
        {options.map((o) => {
          const picked = answer === o;
          const showCorrect = answer && o === question;
          return (
            <Pressable
              key={o.w}
              disabled={correct}
              onPress={() => setAnswer(o)}
              style={[
                styles.option,
                {
                  borderColor: showCorrect
                    ? sectionColors.home
                    : picked
                      ? '#B91C1C'
                      : colors[scheme].border,
                  backgroundColor: showCorrect
                    ? withAlpha(sectionColors.home, 0.1)
                    : picked
                      ? withAlpha('#B91C1C', 0.08)
                      : colors[scheme].background,
                },
              ]}
            >
              <ThemedText variant="body">{o.w}</ThemedText>
            </Pressable>
          );
        })}
      </View>

      {answer ? (
        <ThemedText variant="body" style={{ color: correct ? sectionColors.home : '#B91C1C' }}>
          {correct ? '🎉 Great job!' : 'Try again!'}
        </ThemedText>
      ) : null}

      {correct ? (
        <Button
          title="Next word ▶"
          accent="vocab"
          onPress={() => {
            setAnswer(null);
            setQuizState(makeQuestion(pool));
          }}
        />
      ) : null}
    </View>
  );
}

function makeQuestion(pool: DictionaryWord[]) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const question = shuffled[0];
  const distractors = shuffled.slice(1, 3);
  const options = [question, ...distractors].sort(() => Math.random() - 0.5);
  return { question, options };
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
  tabRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
  },
  list: {
    gap: spacing.sm,
  },
  card: {
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveChip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.pill,
  },
  pos: {
    fontStyle: 'italic',
  },
  example: {
    fontStyle: 'italic',
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  option: {
    borderWidth: 2,
    borderRadius: radii.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
});
