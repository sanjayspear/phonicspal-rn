import { expoSpeechEngine } from '@phonicspal/speech';
import { Button, colors, radii, sectionColors, spacing, useScheme, withAlpha, type SectionId } from '@phonicspal/ui';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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

export interface ReadAloudCardProps {
  text: string;
  accent: SectionId;
}

// The read-aloud UI shared by /read/[id] (a story) and /books/[id] (an
// uploaded text file): renders the text with the currently-spoken word
// highlighted live via expo-speech's onBoundary callback, plus a
// Play/Stop control.
export function ReadAloudCard({ text, accent }: ReadAloudCardProps) {
  const scheme = useScheme();
  const color = sectionColors[accent];
  const tokens = useMemo(() => tokenize(text), [text]);

  const [playing, setPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => () => expoSpeechEngine.stop(), []);

  async function play() {
    setPlaying(true);
    setActiveIndex(null);
    await expoSpeechEngine.say(text, {
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

  return (
    <>
      <View style={[styles.card, { backgroundColor: colors[scheme].background }]}>
        <Text style={styles.text}>
          {tokens.map((t, i) => (
            <Text
              key={i}
              style={[
                styles.word,
                i === activeIndex && { backgroundColor: withAlpha(color, 0.25), color },
              ]}
            >
              {t.text}{' '}
            </Text>
          ))}
        </Text>
      </View>

      {playing ? (
        <Button title="⏹ Stop" variant="secondary" accent={accent} onPress={stop} />
      ) : (
        <Button title="▶ Listen" accent={accent} onPress={play} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    padding: spacing.lg,
  },
  text: {
    fontSize: 22,
    lineHeight: 36,
  },
  word: {
    borderRadius: radii.sm,
  },
});
