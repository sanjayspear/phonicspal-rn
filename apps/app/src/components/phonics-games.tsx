import { LETTER_SOUNDS, type LetterMatchWord, type SoundFocusWord, type SoundPair } from '@phonicspal/core';
import { expoSpeechEngine } from '@phonicspal/speech';
import {
  Button,
  RewardBurst,
  ThemedText,
  colors,
  radii,
  sectionColors,
  spacing,
  useScheme,
  withAlpha,
} from '@phonicspal/ui';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

function shuffled<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function DoneCard({ score, total, onRestart }: { score: number; total: number; onRestart: () => void }) {
  const scheme = useScheme();
  return (
    <View style={[styles.card, { backgroundColor: colors[scheme].background }]}>
      <ThemedText variant="subtitle">
        🎉 All done! {score} of {total} correct.
      </ThemedText>
      <Button title="Play again" accent="phonics" onPress={onRestart} />
    </View>
  );
}

// 'listen'-view game (Listening for Sounds): hear two words, say whether
// they're the same or different — the topic's own "are two words the same
// or different?" intro, made into a scored round-by-round game.
export function ListenGame({ pairs }: { pairs: SoundPair[] }) {
  const scheme = useScheme();
  const accent = sectionColors.phonics;
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [rewardTrigger, setRewardTrigger] = useState(0);

  const done = index >= pairs.length;
  const pair = pairs[index];

  async function playPair() {
    expoSpeechEngine.stop();
    await expoSpeechEngine.say(pair.a, { rate: 0.8 });
    await new Promise((r) => setTimeout(r, 450));
    await expoSpeechEngine.say(pair.b, { rate: 0.8 });
  }

  function answerSame(guessSame: boolean) {
    if (answer !== null) return;
    setAnswer(guessSame);
    if (guessSame === pair.same) {
      setScore((s) => s + 1);
      setRewardTrigger((r) => r + 1);
    }
  }

  function restart() {
    setAnswer(null);
    setIndex(0);
    setScore(0);
  }

  if (done) return <DoneCard score={score} total={pairs.length} onRestart={restart} />;

  const correct = answer !== null && answer === pair.same;

  return (
    <View style={[styles.card, { backgroundColor: colors[scheme].background }]}>
      <ThemedText variant="label" color="labelSecondary">
        Round {index + 1} of {pairs.length} · Score {score}
      </ThemedText>
      <Button title="🔊 Listen" accent="phonics" onPress={playPair} />
      <View style={styles.row}>
        <Button
          title="Same"
          variant="secondary"
          accent="phonics"
          disabled={answer !== null}
          onPress={() => answerSame(true)}
        />
        <Button
          title="Different"
          variant="secondary"
          accent="phonics"
          disabled={answer !== null}
          onPress={() => answerSame(false)}
        />
      </View>

      {answer !== null ? (
        <>
          <ThemedText variant="body" style={{ color: correct ? sectionColors.home : '#B91C1C' }}>
            {correct
              ? '✅ Correct!'
              : `❌ “${pair.a}” and “${pair.b}” are ${pair.same ? 'the same' : 'different'}.`}
          </ThemedText>
          <RewardBurst trigger={rewardTrigger}>
            <Text style={styles.reward}>⭐</Text>
          </RewardBurst>
          <Button title="Next ▶" accent="phonics" onPress={() => { setAnswer(null); setIndex((i) => i + 1); }} />
        </>
      ) : null}
    </View>
  );
}

// 'letters'-view game (Initial/Final Consonants): hear a word, tap the
// letter that matches — the topic's own "match the sound to its letter"
// intro, made into a scored round-by-round game.
export function LetterMatchGame({ words }: { words: LetterMatchWord[] }) {
  const scheme = useScheme();
  const accent = sectionColors.phonics;
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [rewardTrigger, setRewardTrigger] = useState(0);

  const done = index >= words.length;
  const item = words[index];
  const allLetters = useMemo(() => Array.from(new Set(words.map((w) => w.letter))), [words]);
  const options = useMemo(() => {
    if (!item) return [];
    const distractors = shuffled(allLetters.filter((l) => l !== item.letter)).slice(0, 2);
    return shuffled([item.letter, ...distractors]);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally re-rolled only when the round (index) changes
  }, [index, allLetters]);

  function speakWord() {
    expoSpeechEngine.stop();
    expoSpeechEngine.say(item.word, { rate: 0.8 });
  }

  function choose(letter: string) {
    if (selected !== null) return;
    setSelected(letter);
    if (letter === item.letter) {
      setScore((s) => s + 1);
      setRewardTrigger((r) => r + 1);
    }
  }

  function restart() {
    setSelected(null);
    setIndex(0);
    setScore(0);
  }

  if (done) return <DoneCard score={score} total={words.length} onRestart={restart} />;

  const correct = selected === item.letter;

  return (
    <View style={[styles.card, { backgroundColor: colors[scheme].background }]}>
      <ThemedText variant="label" color="labelSecondary">
        Word {index + 1} of {words.length} · Score {score}
      </ThemedText>
      <Pressable onPress={speakWord} accessibilityRole="button" style={styles.wordPrompt}>
        <ThemedText variant="title" style={{ color: accent }}>
          🔊 {item.word}
        </ThemedText>
      </Pressable>
      <View style={styles.row}>
        {options.map((l) => {
          const picked = selected === l;
          const showCorrect = selected !== null && l === item.letter;
          return (
            <Pressable
              key={l}
              disabled={selected !== null}
              onPress={() => choose(l)}
              style={[
                styles.optionTile,
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
              <ThemedText variant="title">{l}</ThemedText>
            </Pressable>
          );
        })}
      </View>

      {selected !== null ? (
        <>
          <ThemedText variant="body" style={{ color: correct ? sectionColors.home : '#B91C1C' }}>
            {correct ? '✅ Correct!' : `❌ It's “${item.letter}”.`}
          </ThemedText>
          <RewardBurst trigger={rewardTrigger}>
            <Text style={styles.reward}>⭐</Text>
          </RewardBurst>
          <Button title="Next ▶" accent="phonics" onPress={() => { setSelected(null); setIndex((i) => i + 1); }} />
        </>
      ) : null}
    </View>
  );
}

// 'sounds'-view explorer (Initial/Final/Medial Sounds): segmented word,
// tap to hear it whole or just the focused sound in isolation (via
// LETTER_SOUNDS, so it's the phonic sound and not the letter's alphabet
// name) — exploration rather than a quiz, since there's no wrong answer.
export function SoundFocusExplorer({ words }: { words: SoundFocusWord[] }) {
  const scheme = useScheme();
  const accent = sectionColors.phonics;
  const [index, setIndex] = useState(0);
  const item = words[index];

  function hearWord() {
    expoSpeechEngine.stop();
    expoSpeechEngine.say(item.segments.join(''), { rate: 0.8 });
  }

  function hearSound() {
    const letter = item.segments[item.focusIndex];
    expoSpeechEngine.stop();
    expoSpeechEngine.say(LETTER_SOUNDS[letter] ?? letter, { rate: 0.7 });
  }

  return (
    <View style={[styles.card, { backgroundColor: colors[scheme].background }]}>
      <ThemedText variant="label" color="labelSecondary">
        Word {index + 1} of {words.length}
      </ThemedText>
      <View style={styles.row}>
        {item.segments.map((s, i) => (
          <View
            key={i}
            style={[
              styles.segment,
              { backgroundColor: i === item.focusIndex ? accent : withAlpha(accent, 0.1) },
            ]}
          >
            <ThemedText variant="title" style={{ color: i === item.focusIndex ? '#FFFFFF' : accent }}>
              {s}
            </ThemedText>
          </View>
        ))}
      </View>
      <Button title="🔊 Hear the word" accent="phonics" onPress={hearWord} />
      <Button title="🔊 Hear just this sound" variant="secondary" accent="phonics" onPress={hearSound} />
      <View style={styles.row}>
        <Button
          title="◀ Prev"
          variant="secondary"
          accent="phonics"
          disabled={index === 0}
          onPress={() => setIndex((i) => i - 1)}
        />
        <Button
          title="Next ▶"
          variant="secondary"
          accent="phonics"
          disabled={index === words.length - 1}
          onPress={() => setIndex((i) => i + 1)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.md,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  wordPrompt: {
    paddingVertical: spacing.sm,
  },
  optionTile: {
    minWidth: 64,
    minHeight: 56,
    borderWidth: 2,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  segment: {
    minWidth: 48,
    minHeight: 56,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  reward: {
    fontSize: 28,
  },
});
