import { mockRoster } from '@phonicspal/core';
import { Avatar, Button, ProgressBar, ThemedText, colors, radii, spacing, useScheme } from '@phonicspal/ui';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DashboardShell } from '@/components/dashboard-shell';
import { useActivity } from '@/hooks/use-activity';

export function TeacherDashboard() {
  const { events } = useActivity();

  return (
    <DashboardShell gradientAccent="phonics" title="PhonicsPal">
      <View style={styles.sectionHeader}>
        <ThemedText variant="subtitle">Your Class</ThemedText>
        <ThemedText variant="body" color="labelSecondary">
          Code: XK3F9 · {mockRoster.length} students
        </ThemedText>
      </View>

      <Button title="+ Build a Learning Path" accent="home" onPress={() => router.push('/build-path')} />

      <View style={styles.sectionHeader}>
        <ThemedText variant="body" color="labelSecondary">
          Or tap a student below to view their progress or tweak just their path.
        </ThemedText>
      </View>

      <View style={styles.list}>
        {mockRoster.map((student) => (
          <RosterRow
            key={student.id}
            name={student.name}
            progress={student.topicsCompleted / student.topicsTotal}
            stars={student.stars}
            lastActiveLabel={student.lastActiveLabel}
            onPress={() => router.push(`/build-path/${student.id}`)}
          />
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <ThemedText variant="subtitle">Recent activity</ThemedText>
      </View>

      <View style={styles.list}>
        {events.map((event) => (
          <View key={event.id} style={styles.activityRow}>
            <ThemedText variant="body">
              <ThemedText variant="body" style={styles.bold}>
                {event.studentName}
              </ThemedText>{' '}
              {event.summary}
            </ThemedText>
            <ThemedText variant="label" color="labelSecondary">
              {event.whenLabel}
            </ThemedText>
          </View>
        ))}
      </View>
    </DashboardShell>
  );
}

function RosterRow({
  name,
  progress,
  stars,
  lastActiveLabel,
  onPress,
}: {
  name: string;
  progress: number;
  stars: number;
  lastActiveLabel: string;
  onPress: () => void;
}) {
  const scheme = useScheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={[styles.card, { backgroundColor: colors[scheme].background }]}
    >
      <Avatar name={name} accent="phonics" />
      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <ThemedText variant="subtitle">{name}</ThemedText>
          <ThemedText variant="label" color="labelSecondary">
            {lastActiveLabel}
          </ThemedText>
        </View>
        <ProgressBar progress={progress} accent="phonics" />
        <ThemedText variant="label" color="labelSecondary">
          {Math.round(progress * 100)}% complete · ⭐ {stars}
        </ThemedText>
      </View>
      <Text style={styles.chevron}>→</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  list: {
    gap: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  cardBody: {
    flex: 1,
    gap: spacing.xs,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chevron: {
    fontSize: 16,
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  bold: {
    fontWeight: '700',
  },
});
