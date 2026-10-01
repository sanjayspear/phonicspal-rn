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
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { MAX_BOOK_SIZE, useBooks } from '@/hooks/use-books';

export default function BooksListScreen() {
  const scheme = useScheme();
  const { books, addBook, removeBook } = useBooks();
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function upload() {
    setStatus(null);
    const result = await DocumentPicker.getDocumentAsync({ type: ['text/plain'] });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];

    if (!asset.name.toLowerCase().endsWith('.txt')) {
      setStatus('Please choose a .txt file — PDF and EPUB aren’t supported yet.');
      return;
    }
    if ((asset.size ?? 0) > MAX_BOOK_SIZE) {
      setStatus('That file is bigger than 2MB. Please choose a smaller one.');
      return;
    }

    setUploading(true);
    try {
      const text = asset.file ? await asset.file.text() : await (await fetch(asset.uri)).text();
      const trimmed = text.replace(/[ \t]+/g, ' ').trim();
      if (trimmed.length < 20) throw new Error('empty');
      addBook({ name: asset.name.replace(/\.txt$/i, ''), size: asset.size ?? trimmed.length, text: trimmed });
      setStatus('Done! Your book is ready.');
    } catch {
      setStatus('Sorry, that file didn’t have readable text in it.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[withAlpha(sectionColors.books, 0.16), colors[scheme].background]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <ScreenHeader title="Books" />
          <ThemedText variant="body" color="labelSecondary">
            Upload a .txt file (up to 2MB) to add it to your library. PDF and EPUB support isn
            {'’'}t built yet.
          </ThemedText>

          <Button title="＋ Upload a .txt file" accent="books" onPress={upload} loading={uploading} />
          {status ? (
            <ThemedText variant="body" color="labelSecondary">
              {status}
            </ThemedText>
          ) : null}

          <View style={styles.sectionHeader}>
            <ThemedText variant="subtitle">Your Library</ThemedText>
          </View>

          {books.length === 0 ? (
            <ThemedText variant="body" color="labelSecondary">
              No books yet. Upload one above!
            </ThemedText>
          ) : (
            <View style={styles.list}>
              {books.map((book) => (
                <View key={book.id} style={[styles.card, { backgroundColor: colors[scheme].background }]}>
                  <View style={styles.cardText}>
                    <ThemedText variant="subtitle">{book.name}</ThemedText>
                    <ThemedText variant="label" color="labelSecondary">
                      TXT · {(book.size / 1024).toFixed(0)} KB
                    </ThemedText>
                  </View>
                  <Pressable onPress={() => router.push(`/books/${book.id}`)} hitSlop={6}>
                    <ThemedText variant="label" style={{ color: sectionColors.books }}>
                      Open
                    </ThemedText>
                  </Pressable>
                  <Pressable onPress={() => removeBook(book.id)} hitSlop={6}>
                    <ThemedText variant="label" color="labelSecondary" style={styles.remove}>
                      Delete
                    </ThemedText>
                  </Pressable>
                </View>
              ))}
            </View>
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
  sectionHeader: {
    marginTop: spacing.sm,
  },
  list: {
    gap: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radii.xl,
    padding: spacing.md,
  },
  cardText: {
    flex: 1,
    gap: spacing.xs,
  },
  remove: {
    textDecorationLine: 'underline',
  },
});
