import { ThemedText, spacing } from '@phonicspal/ui';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

export interface ScreenHeaderProps {
  title: string;
}

// Back-button header for sub-screens reached by drilling in from a
// dashboard (e.g. a Phonics topic list/detail) — the three dashboards
// use DashboardShell instead, which has its own top-level chrome.
export function ScreenHeader({ title }: ScreenHeaderProps) {
  return (
    <View style={styles.row}>
      <Pressable onPress={() => router.back()} accessibilityRole="button" hitSlop={8}>
        <ThemedText variant="subtitle">← Back</ThemedText>
      </Pressable>
      <ThemedText variant="title">{title}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.sm,
  },
});
