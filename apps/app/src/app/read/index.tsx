import { stories } from '@phonicspal/core';
import {
  Button,
  TextField,
  ThemedText,
  colors,
  radii,
  sectionColors,
  spacing,
  useScheme,
  withAlpha,
} from '@phonicspal/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { useCustomStories } from '@/hooks/use-custom-stories';

export default function ReadListScreen() {
  const scheme = useScheme();
  const { stories: customStories, addStory, removeStory } = useCustomStories();
  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  function saveStory() {
    const cleanTitle = title.trim();
    const cleanText = text.trim();
    if (!cleanTitle || !cleanText) {
      setError('Give your story a title and some words to read.');
      return;
    }
    addStory({ title: cleanTitle, text: cleanText });
    setTitle('');
    setText('');
    setError(null);
    setComposing(false);
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[withAlpha(sectionColors.read, 0.16), colors[scheme].background]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <ScreenHeader title="Read" />
          <ThemedText variant="body" color="labelSecondary">
            {stories.length} short stories — tap one to listen and follow along.
          </ThemedText>

          <View style={styles.list}>
            {stories.map((story) => (
              <Pressable
                key={story.id}
                onPress={() => router.push(`/read/${story.id}`)}
                style={[styles.row, { backgroundColor: colors[scheme].background }]}
                accessibilityRole="button"
              >
                <Text style={styles.icon}>{story.icon}</Text>
                <View style={styles.rowText}>
                  <ThemedText variant="subtitle">{story.title}</ThemedText>
                  <ThemedText variant="body" color="labelSecondary" numberOfLines={1}>
                    {story.lines[0]}
                  </ThemedText>
                </View>
                <Text style={styles.chevron}>→</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <ThemedText variant="subtitle">Your Stories</ThemedText>
            <ThemedText variant="body" color="labelSecondary">
              Paste or write your own text to listen to — same TTS and word-lookup as every
              other story here.
            </ThemedText>
          </View>

          {composing ? (
            <View style={[styles.composer, { backgroundColor: colors[scheme].background }]}>
              <TextField label="Title" value={title} onChangeText={setTitle} placeholder="My Story" />
              <TextField
                label="Story text"
                value={text}
                onChangeText={setText}
                placeholder="Paste or type the story here…"
                multiline
                style={styles.textArea}
              />
              {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
              <View style={styles.composerActions}>
                <Button title="Save story" accent="read" onPress={saveStory} />
                <Button
                  title="Cancel"
                  variant="secondary"
                  accent="read"
                  onPress={() => {
                    setComposing(false);
                    setError(null);
                  }}
                />
              </View>
            </View>
          ) : (
            <Button title="+ Write your own story" accent="read" onPress={() => setComposing(true)} />
          )}

          {customStories.length > 0 ? (
            <View style={styles.list}>
              {customStories.map((story) => (
                <View key={story.id} style={[styles.row, { backgroundColor: colors[scheme].background }]}>
                  <Pressable
                    onPress={() => router.push(`/read/${story.id}`)}
                    accessibilityRole="button"
                    style={styles.rowPressable}
                  >
                    <Text style={styles.icon}>📝</Text>
                    <View style={styles.rowText}>
                      <ThemedText variant="subtitle">{story.title}</ThemedText>
                      <ThemedText variant="body" color="labelSecondary" numberOfLines={1}>
                        {story.text}
                      </ThemedText>
                    </View>
                  </Pressable>
                  <Pressable onPress={() => removeStory(story.id)} hitSlop={8}>
                    <ThemedText variant="label" color="labelSecondary" style={styles.remove}>
                      Delete
                    </ThemedText>
                  </Pressable>
                </View>
              ))}
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
  list: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radii.xl,
    padding: spacing.md,
  },
  rowPressable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  icon: {
    fontSize: 32,
  },
  rowText: {
    flex: 1,
    gap: spacing.xs,
  },
  chevron: {
    fontSize: 18,
    color: sectionColors.read,
  },
  remove: {
    textDecorationLine: 'underline',
  },
  sectionHeader: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  composer: {
    borderRadius: radii.xl,
    padding: spacing.md,
    gap: spacing.md,
  },
  textArea: {
    minHeight: 140,
    paddingTop: spacing.sm,
    textAlignVertical: 'top',
  },
  composerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  error: {
    color: '#B91C1C',
  },
});
