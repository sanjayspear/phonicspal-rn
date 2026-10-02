import { getStory } from '@phonicspal/core';
import { ThemedText, colors, sectionColors, spacing, useScheme, withAlpha } from '@phonicspal/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ReadAloudCard } from '@/components/read-aloud-card';
import { ScreenHeader } from '@/components/screen-header';
import { useCustomStories } from '@/hooks/use-custom-stories';

export default function ReadStoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scheme = useScheme();
  const presetStory = getStory(id);
  const { stories: customStories } = useCustomStories();
  const customStory = customStories.find((s) => s.id === id);

  const title = presetStory ? `${presetStory.icon} ${presetStory.title}` : customStory ? `📝 ${customStory.title}` : '';
  const fullText = useMemo(
    () => presetStory?.lines.join(' ') ?? customStory?.text ?? '',
    [presetStory, customStory]
  );

  if (!presetStory && !customStory) {
    return (
      <View style={styles.root}>
        <SafeAreaView style={styles.flex} edges={['top']}>
          <View style={styles.content}>
            <ScreenHeader title="Not found" />
            <ThemedText variant="body" color="labelSecondary">
              That story doesn't exist — it may have been deleted.
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
          <ScreenHeader title={title} />
          <ReadAloudCard text={fullText} accent="read" />
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
});
