import { ThemedText, spacing } from '@phonicspal/ui';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

export interface ScreenHeaderProps {
  title: string;
}

// router.back() throws/no-ops with a console warning when there's no
// history to go back to (a direct deep link, a reload, a fast-refresh that
// wiped navigation state) — fall back to a known-good route instead.
export function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

// Back-button header for sub-screens reached by drilling in from a
// dashboard (e.g. a Phonics topic list/detail) — the three dashboards
// use DashboardShell instead, which has its own top-level chrome.
export function ScreenHeader({ title }: ScreenHeaderProps) {
  return (
    <View style={styles.row}>
      <Pressable onPress={goBack} accessibilityRole="button" hitSlop={8}>
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
