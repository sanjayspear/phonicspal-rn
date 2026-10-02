import type { DictionaryWord } from '@phonicspal/core';
import { expoSpeechEngine } from '@phonicspal/speech';
import {
  Button,
  ThemedText,
  colors,
  radii,
  sectionColors,
  spacing,
  useScheme,
  withAlpha,
  type SectionId,
} from '@phonicspal/ui';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useVocabulary } from '@/hooks/use-vocabulary';
import { lookupWord } from '@/lib/dictionary-lookup';

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

// Words per page: rendering an entire uploaded book as one ScrollView made
// "listen to the whole thing" mean scrolling forever to find your place.
// ~180 words is roughly a screen and a half at this card's font size —
// long enough to feel like real reading, short enough that Play finishes
// in well under a minute.
const WORDS_PER_PAGE = 180;

function paginate(tokens: Token[]): Token[][] {
  if (tokens.length === 0) return [[]];
  const pages: Token[][] = [];
  for (let i = 0; i < tokens.length; i += WORDS_PER_PAGE) {
    pages.push(tokens.slice(i, i + WORDS_PER_PAGE));
  }
  return pages;
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
  const pages = useMemo(() => paginate(tokens), [tokens]);
  const { isSaved, saveWord } = useVocabulary();

  const [pageIndex, setPageIndex] = useState(0);
  const page = Math.min(pageIndex, pages.length - 1);
  const pageTokens = pages[page];
  // Tokens carry offsets into the full `text`; re-base them to the start
  // of this page's own substring so onBoundary's charIndex (relative to
  // whatever string was actually spoken) lines up with pageTokens' indices.
  const pageOffset = pageTokens[0]?.start ?? 0;
  const pageText = pageTokens.length
    ? text.slice(pageOffset, pageTokens[pageTokens.length - 1].end)
    : '';

  const [playing, setPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Changing page (or loading a different book/story) stops whatever was
  // playing rather than leaving it reading from a page no longer on screen.
  useEffect(() => {
    expoSpeechEngine.stop();
    setPlaying(false);
    setActiveIndex(null);
  }, [page, text]);

  useEffect(() => setPageIndex(0), [text]);

  // Word-lookup sheet state — tapping any word (whether or not TTS is
  // playing) looks it up without interrupting playback, so a child can tap
  // a word they like mid-listen (docs/DESIGN.md's vocabulary-saving flow).
  const [lookupWordText, setLookupWordText] = useState<string | null>(null);
  const [lookupResult, setLookupResult] = useState<DictionaryWord | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupFailed, setLookupFailed] = useState(false);

  useEffect(() => () => expoSpeechEngine.stop(), []);

  async function handleWordPress(rawWord: string) {
    const clean = rawWord.replace(/[^a-zA-Z']/g, '');
    if (!clean) return;

    setLookupWordText(clean);
    setLookupResult(null);
    setLookupFailed(false);
    setLookupLoading(true);
    const result = await lookupWord(clean);
    setLookupLoading(false);
    if (result) setLookupResult(result);
    else setLookupFailed(true);
  }

  function closeLookup() {
    setLookupWordText(null);
    setLookupResult(null);
    setLookupFailed(false);
  }

  async function play() {
    setPlaying(true);
    setActiveIndex(null);
    await expoSpeechEngine.say(pageText, {
      rate: 0.8,
      onBoundary: (e) => {
        const idx = pageTokens.findIndex(
          (t) => e.charIndex >= t.start - pageOffset && e.charIndex < t.end - pageOffset
        );
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

  function goToPage(next: number) {
    stop();
    setPageIndex(Math.max(0, Math.min(pages.length - 1, next)));
  }

  return (
    <>
      <View style={[styles.card, { backgroundColor: colors[scheme].background }]}>
        <Text style={styles.text}>
          {pageTokens.map((t, i) => (
            <Text
              key={i}
              onPress={() => handleWordPress(t.text)}
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

      {pages.length > 1 ? (
        <View style={styles.pager}>
          <Button
            title="◀ Prev"
            variant="secondary"
            accent={accent}
            disabled={page === 0}
            onPress={() => goToPage(page - 1)}
          />
          <ThemedText variant="body" color="labelSecondary">
            Page {page + 1} of {pages.length}
          </ThemedText>
          <Button
            title="Next ▶"
            variant="secondary"
            accent={accent}
            disabled={page === pages.length - 1}
            onPress={() => goToPage(page + 1)}
          />
        </View>
      ) : null}

      <Modal visible={lookupWordText !== null} transparent animationType="fade" onRequestClose={closeLookup}>
        <Pressable style={styles.backdrop} onPress={closeLookup}>
          {/* Stops the tap from reaching the backdrop's onPress above (react-native-web renders real DOM nodes, so untrapped clicks bubble). */}
          <Pressable
            style={[styles.sheet, { backgroundColor: colors[scheme].background }]}
            onPress={(e) => e.stopPropagation()}
          >
            <ThemedText variant="subtitle">{lookupWordText}</ThemedText>

            {lookupLoading ? (
              <ActivityIndicator color={color} />
            ) : lookupResult ? (
              <>
                <ThemedText variant="body" color="labelSecondary" style={styles.italic}>
                  {lookupResult.p}
                </ThemedText>
                <ThemedText variant="body">{lookupResult.m}</ThemedText>
                {lookupResult.e ? (
                  <ThemedText variant="body" color="labelSecondary" style={styles.italic}>
                    “{lookupResult.e}”
                  </ThemedText>
                ) : null}
                <Button
                  title={isSaved(lookupResult.w) ? '✓ Saved to My Vocabulary' : '+ Save to My Vocabulary'}
                  accent="vocab"
                  disabled={isSaved(lookupResult.w)}
                  onPress={() => saveWord(lookupResult)}
                />
              </>
            ) : lookupFailed ? (
              <ThemedText variant="body" color="labelSecondary">
                No definition found for this word.
              </ThemedText>
            ) : null}

            <Button title="Close" variant="secondary" accent={accent} onPress={closeLookup} />
          </Pressable>
        </Pressable>
      </Modal>
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
  pager: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  sheet: {
    width: '100%',
    maxWidth: 420,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  italic: {
    fontStyle: 'italic',
  },
});
