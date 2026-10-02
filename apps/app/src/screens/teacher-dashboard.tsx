import { Avatar, Button, ProgressBar, ThemedText, colors, radii, spacing, useScheme } from '@phonicspal/ui';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { DashboardShell } from '@/components/dashboard-shell';
import { useActivity } from '@/hooks/use-activity';
import { useLearningPaths } from '@/hooks/use-learning-paths';

// There's no pre-existing roster anymore — the broadcast model
// (docs/DESIGN.md's CR-3) means the only students this screen knows about
// are the ones who've actually self-identified and started the path
// (getAllPaths()), so "Your Class" is real submission data, not static
// mock stats.
export function TeacherDashboard() {
  const scheme = useScheme();
  const { events } = useActivity();
  const { getAllPaths } = useLearningPaths();
  const studentPaths = getAllPaths();

  return (
    <DashboardShell gradientAccent="phonics" title="PhonicsPal">
      <View style={styles.sectionHeader}>
        <ThemedText variant="subtitle">Your Class</ThemedText>
        <ThemedText variant="body" color="labelSecondary">
          {studentPaths.length === 0
            ? 'No students have started yet — they show up here once a parent identifies their child.'
            : `${studentPaths.length} student${studentPaths.length === 1 ? '' : 's'} tracked so far.`}
        </ThemedText>
      </View>

      <Button title="+ Build a Learning Path" accent="home" onPress={() => router.push('/build-path')} />

      {studentPaths.length > 0 ? (
        <View style={styles.list}>
          {studentPaths.map((path) => {
            const total = path.nodes.length;
            const done = path.nodes.filter((n) => n.status === 'submitted').length;
            const progress = total ? done / total : 0;
            return (
              <View key={path.studentId} style={[styles.card, { backgroundColor: colors[scheme].background }]}>
                <Avatar name={path.studentName ?? path.studentId} accent="phonics" />
                <View style={styles.cardBody}>
                  <View style={styles.cardTopRow}>
                    <ThemedText variant="subtitle">{path.studentName ?? path.studentId}</ThemedText>
                    <ThemedText variant="label" color="labelSecondary">
                      ID {path.studentId}
                    </ThemedText>
                  </View>
                  <ThemedText variant="label" color="labelSecondary">
                    {path.className ? `${path.className} · Section ${path.section}` : 'No class on file'}
                  </ThemedText>
                  <ProgressBar progress={progress} accent="phonics" />
                  <ThemedText variant="label" color="labelSecondary">
                    {done} of {total} done
                  </ThemedText>
                </View>
              </View>
            );
          })}
        </View>
      ) : null}

      <View style={styles.sectionHeader}>
        <ThemedText variant="subtitle">Recent activity</ThemedText>
      </View>

      <View style={styles.list}>
        {events.map((event) => (
          <View key={event.id} style={styles.activityRow}>
            <View style={styles.activityText}>
              <ThemedText variant="body">
                <ThemedText variant="body" style={styles.bold}>
                  {event.studentName}
                </ThemedText>{' '}
                {event.summary}
              </ThemedText>
              {event.className ? (
                <ThemedText variant="label" color="labelSecondary">
                  {event.className} · Section {event.section} · ID {event.studentId}
                </ThemedText>
              ) : null}
            </View>
            <ThemedText variant="label" color="labelSecondary">
              {event.whenLabel}
            </ThemedText>
          </View>
        ))}
      </View>
    </DashboardShell>
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
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },
  activityText: {
    flex: 1,
    gap: 2,
  },
  bold: {
    fontWeight: '700',
  },
});
