import {
  Button,
  ThemedText,
  colors,
  radii,
  sectionColors,
  spacing,
  useScheme,
  type SectionId,
} from '@phonicspal/ui';
import { ActivityIndicator, Modal, Pressable, StyleSheet } from 'react-native';

import { useVocabulary } from '@/hooks/use-vocabulary';
import type { WordLookupState } from '@/hooks/use-word-lookup';

export interface WordLookupSheetProps {
  lookup: WordLookupState;
  accent: SectionId;
  // An extra primary action shown above Close, e.g. Read/Books' "Read from
  // here" (resumes playback at the looked-up word) — omitted where it
  // doesn't apply, like Phonics' word-bearing cards.
  extraAction?: { title: string; onPress: () => void };
}

// The "tap a word, see its meaning, save it" sheet — shared by Read/Books
// (apps/app/src/components/read-aloud-card.tsx) and Phonics' word-bearing
// cards, so both read from the same useWordLookup() state shape and the
// same definition/save UI instead of two copies drifting apart.
export function WordLookupSheet({ lookup, accent, extraAction }: WordLookupSheetProps) {
  const scheme = useScheme();
  const color = sectionColors[accent];
  const { isSaved, saveWord } = useVocabulary();
  const { word, result, loading, failed, close } = lookup;

  return (
    <Modal visible={word !== null} transparent animationType="fade" onRequestClose={close}>
      <Pressable style={styles.backdrop} onPress={close}>
        {/* Stops the tap from reaching the backdrop's onPress above (react-native-web renders real DOM nodes, so untrapped clicks bubble). */}
        <Pressable
          style={[styles.sheet, { backgroundColor: colors[scheme].background }]}
          onPress={(e) => e.stopPropagation()}
        >
          <ThemedText variant="subtitle">{word}</ThemedText>

          {loading ? (
            <ActivityIndicator color={color} />
          ) : result ? (
            <>
              <ThemedText variant="body" color="labelSecondary" style={styles.italic}>
                {result.p}
              </ThemedText>
              <ThemedText variant="body">{result.m}</ThemedText>
              {result.e ? (
                <ThemedText variant="body" color="labelSecondary" style={styles.italic}>
                  “{result.e}”
                </ThemedText>
              ) : null}
              <Button
                title={isSaved(result.w) ? '✓ Saved to My Vocabulary' : '+ Save to My Vocabulary'}
                accent="vocab"
                disabled={isSaved(result.w)}
                onPress={() => saveWord(result)}
              />
            </>
          ) : failed ? (
            <ThemedText variant="body" color="labelSecondary">
              No definition found for this word.
            </ThemedText>
          ) : null}

          {extraAction ? (
            <Button title={extraAction.title} accent={accent} onPress={extraAction.onPress} />
          ) : null}
          <Button title="Close" variant="secondary" accent={accent} onPress={close} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
