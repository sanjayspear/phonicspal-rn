import { mockChildName, mockLearningPath, mockNodeTitles } from '@phonicspal/core';
import {
  Avatar,
  Button,
  ProgressBar,
  SectionCard,
  ThemedText,
  colors,
  radii,
  spacing,
  useScheme,
  type SectionId,
} from '@phonicspal/ui';
import { StyleSheet, Text, View } from 'react-native';

import { DashboardShell } from '@/components/dashboard-shell';

const FREE_PLAY: { section: SectionId; title: string; subtitle: string; icon: string }[] = [
  { section: 'phonics', title: 'Phonics', subtitle: '62 topics to explore', icon: '🔤' },
  { section: 'read', title: 'Read', subtitle: 'Listen and follow along', icon: '📖' },
  { section: 'books', title: 'Books', subtitle: 'Your library', icon: '📚' },
  { section: 'vocab', title: 'Vocab', subtitle: 'Saved words', icon: '⭐' },
];

const STATUS_ICON: Record<string, string> = {
  submitted: '✅',
  in_progress: '🔵',
  available: '⚪️',
  locked: '🔒',
  reviewed: '⭐',
};

export function ParentDashboard() {
  const scheme = useScheme();
  const nodes = [...mockLearningPath.nodes].sort((a, b) => a.order - b.order);
  const progress = nodes.filter((n) => n.status === 'submitted').length / nodes.length;
  const nextNode = nodes.find((n) => n.status !== 'submitted');

  return (
    <DashboardShell gradientAccent="home" title="PhonicsPal">
      <View style={[styles.card, { backgroundColor: colors[scheme].background }]}>
        <View style={styles.cardHeader}>
          <Avatar name={mockChildName} accent="home" size={56} />
          <View style={styles.cardHeaderText}>
            <ThemedText variant="subtitle">{mockChildName}'s Learning Path</ThemedText>
            <ThemedText variant="body" color="labelSecondary">
              {nodes.filter((n) => n.status === 'submitted').length} of {nodes.length} done
            </ThemedText>
          </View>
        </View>

        <ProgressBar progress={progress} accent="home" />

        <View style={styles.nodeList}>
          {nodes.map((node) => (
            <View key={node.id} style={styles.nodeRow}>
              <Text style={styles.nodeIcon}>{STATUS_ICON[node.status]}</Text>
              <ThemedText
                variant="body"
                color={node.status === 'locked' ? 'labelSecondary' : 'label'}
              >
                {mockNodeTitles[node.refId] ?? node.refId}
              </ThemedText>
            </View>
          ))}
        </View>

        {nextNode ? (
          <Button
            title={`Continue: ${mockNodeTitles[nextNode.refId] ?? nextNode.refId}`}
            accent="home"
            onPress={() => {}}
          />
        ) : (
          <ThemedText variant="body" color="labelSecondary">
            All caught up — great work! 🎉
          </ThemedText>
        )}
      </View>

      <View style={styles.sectionHeader}>
        <ThemedText variant="subtitle">Or explore on your own</ThemedText>
      </View>

      <View style={styles.freePlay}>
        {FREE_PLAY.map((item) => (
          <SectionCard
            key={item.section}
            section={item.section}
            title={item.title}
            subtitle={item.subtitle}
            icon={<Text style={styles.cardIcon}>{item.icon}</Text>}
            onPress={() => {}}
          />
        ))}
      </View>
    </DashboardShell>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  cardHeaderText: {
    flex: 1,
    gap: spacing.xs,
  },
  nodeList: {
    gap: spacing.sm,
  },
  nodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  nodeIcon: {
    fontSize: 16,
  },
  sectionHeader: {
    marginTop: spacing.sm,
  },
  freePlay: {
    gap: spacing.md,
  },
  cardIcon: {
    fontSize: 28,
  },
});
