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
import { MAX_TEXT_LENGTH, MAX_UPLOAD_SIZE, useBooks, type BookExt } from '@/hooks/use-books';
import { extractEpubText } from '@/lib/epub-text';
import { extractPdfText } from '@/lib/pdf-text';

const ACCEPTED_TYPES = ['text/plain', 'application/pdf', 'application/epub+zip'];

function extOf(name: string): BookExt | null {
  const ext = name.split('.').pop()?.toLowerCase();
  return ext === 'txt' || ext === 'pdf' || ext === 'epub' ? ext : null;
}

export default function BooksListScreen() {
  const scheme = useScheme();
  const { books, addBook, removeBook } = useBooks();
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function readBytes(asset: DocumentPicker.DocumentPickerAsset): Promise<ArrayBuffer> {
    return asset.file ? await asset.file.arrayBuffer() : await (await fetch(asset.uri)).arrayBuffer();
  }

  async function upload() {
    setStatus(null);
    const result = await DocumentPicker.getDocumentAsync({ type: ACCEPTED_TYPES });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];

    const ext = extOf(asset.name);
    if (!ext) {
      setStatus('Please choose a PDF, TXT or EPUB file.');
      return;
    }
    if ((asset.size ?? 0) > MAX_UPLOAD_SIZE) {
      setStatus('That file is bigger than 35MB. Please choose a smaller one.');
      return;
    }

    setUploading(true);
    try {
      let text: string;
      if (ext === 'txt') {
        text = asset.file ? await asset.file.text() : await (await fetch(asset.uri)).text();
      } else if (ext === 'pdf') {
        setStatus('Reading your book…');
        text = await extractPdfText(await readBytes(asset), (page, total) =>
          setStatus(`Reading page ${page} of ${total}…`)
        );
      } else {
        setStatus('Reading your book…');
        text = await extractEpubText(await readBytes(asset));
      }

      let trimmed = text.replace(/[ \t]+/g, ' ').trim();
      if (trimmed.length < 20) throw new Error('empty');
      if (trimmed.length > MAX_TEXT_LENGTH) {
        trimmed = trimmed.slice(0, MAX_TEXT_LENGTH);
        setStatus('Done! The book was long, so only the first part was saved.');
      } else {
        setStatus('Done! Your book is ready.');
      }

      addBook({ name: asset.name.replace(/\.[^.]+$/, ''), ext, size: asset.size ?? trimmed.length, text: trimmed });
    } catch {
      setStatus('Sorry, I could not find readable text in that file. Scanned or protected files may not work.');
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
            Upload a PDF, TXT or EPUB file (up to 35MB) to add it to your library.
          </ThemedText>

          <Button title="＋ Upload a book" accent="books" onPress={upload} loading={uploading} />
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
                      {book.ext.toUpperCase()} · {(book.size / 1048576).toFixed(1)} MB
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
