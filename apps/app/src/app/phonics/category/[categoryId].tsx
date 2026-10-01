import { getPhonicsTopic, topicCategories } from '@phonicspal/core';
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
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';

const INTERACTIVE_VIEWS = new Set(['cards', 'groups', 'words']);

export default function PhonicsCategoryScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const scheme = useScheme();
  const category = topicCategories.find((c) => c.id === categoryId);
  const topics = (category?.topicIds ?? []).map(getPhonicsTopic).filter((t) => t != null);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[withAlpha(sectionColors.phonics, 0.16), colors[scheme].background]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <ScreenHeader title={category ? `${category.icon} ${category.name}` : 'Not found'} />

          <View style={styles.list}>
            {topics.map((topic) => {
              const interactive = INTERACTIVE_VIEWS.has(topic.view);
              return (
                <Pressable
                  key={topic.id}
                  onPress={() => router.push(`/phonics/${topic.id}`)}
                  style={[styles.row, { backgroundColor: colors[scheme].background }]}
                  accessibilityRole="button"
                >
                  <Text style={styles.icon}>{topic.icon}</Text>
                  <View style={styles.rowText}>
                    <ThemedText variant="subtitle">{topic.name}</ThemedText>
                    <ThemedText variant="body" color="labelSecondary" numberOfLines={2}>
                      {topic.intro}
                    </ThemedText>
                    {!interactive ? (
                      <ThemedText variant="label" color="labelSecondary">
                        PRACTICE VIEW COMING SOON
                      </ThemedText>
                    ) : null}
                  </View>
                  <Text style={styles.chevron}>→</Text>
                </Pressable>
              );
            })}
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
    color: sectionColors.phonics,
  },
});
