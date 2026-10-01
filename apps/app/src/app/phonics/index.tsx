import { phonicsTopics } from '@phonicspal/core';
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

export default function PhonicsListScreen() {
  const scheme = useScheme();

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[withAlpha(sectionColors.phonics, 0.16), colors[scheme].background]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <ScreenHeader title="Phonics" />
          <ThemedText variant="body" color="labelSecondary">
            {phonicsTopics.length} topics so far — more are being ported from the original app.
          </ThemedText>

          <View style={styles.list}>
            {phonicsTopics.map((topic) => (
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
    color: sectionColors.phonics,
  },
});
