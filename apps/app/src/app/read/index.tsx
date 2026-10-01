import { stories } from '@phonicspal/core';
import {
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
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';

export default function ReadListScreen() {
  const scheme = useScheme();

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
});
