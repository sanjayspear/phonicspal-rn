import { getNodeTitle, mockChildName, mockLearningPath } from '@phonicspal/core';
import {
  Avatar,
  Button,
  ProgressBar,
  RewardBurst,
  ThemedText,
  colors,
  radii,
  spacing,
  useScheme,
} from '@phonicspal/ui';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { DashboardShell } from '@/components/dashboard-shell';
import { useActivity } from '@/hooks/use-activity';
import { useLearningPaths } from '@/hooks/use-learning-paths';

const CHILD_STUDENT_ID = mockLearningPath.studentId;

const STATUS_ICON: Record<string, string> = {
  submitted: '✅',
  in_progress: '🔵',
  available: '⚪️',
  locked: '🔒',
  reviewed: '⭐',
};

export function ParentDashboard() {
  const scheme = useScheme();
  const { getPath, submitNode } = useLearningPaths();
  const { addEvent } = useActivity();

  const path = getPath(CHILD_STUDENT_ID) ?? mockLearningPath;
  const nodes = [...path.nodes].sort((a, b) => a.order - b.order);
  const submittedCount = nodes.filter((n) => n.status === 'submitted').length;
  const progress = nodes.length ? submittedCount / nodes.length : 0;
  const nextIndex = nodes.findIndex((n) => n.status !== 'submitted');
  const nextNode = nextIndex === -1 ? undefined : nodes[nextIndex];

  // Fires on any increase in submitted count, not just the dashboard's own
  // button — a topic node submitted from the guided phonics screen (see
  // phonics/[id].tsx) lands here too once this screen re-renders.
  const [rewardTrigger, setRewardTrigger] = useState(0);
  const prevSubmittedCount = useRef(submittedCount);
  useEffect(() => {
    if (submittedCount > prevSubmittedCount.current) setRewardTrigger((r) => r + 1);
    prevSubmittedCount.current = submittedCount;
  }, [submittedCount]);

  function continueNext() {
    if (!nextNode) return;
    if (nextNode.type === 'topic') {
      // Deep-link into the real topic screen in guided mode — it shows the
      // "for grown-ups" tip and a Submit button, and submits from there
      // (docs/DESIGN.md §4.3), instead of marking it done sight-unseen.
      router.push(`/phonics/${nextNode.refId}?pathNodeId=${nextNode.id}&studentId=${CHILD_STUDENT_ID}`);
      return;
    }
    // Assignment nodes are free-text instructions with no screen of their
    // own — submit in place once the parent's done them with the child.
    submitNode(CHILD_STUDENT_ID, nextNode.id);
    addEvent({ studentName: mockChildName, summary: `Submitted ${getNodeTitle(nextNode)}`, whenLabel: 'Just now' });
  }

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
          <RewardBurst trigger={rewardTrigger}>
            <Text style={styles.rewardStar}>⭐</Text>
          </RewardBurst>
        </View>

        {nodes.length ? (
          <>
            <ProgressBar progress={progress} accent="home" />

            <View style={styles.nodeList}>
              {nodes.map((node) => (
                <View key={node.id} style={styles.nodeRow}>
                  <Text style={styles.nodeIcon}>{STATUS_ICON[node.status]}</Text>
                  <ThemedText
                    variant="body"
                    color={node.status === 'locked' ? 'labelSecondary' : 'label'}
                  >
                    {getNodeTitle(node)}
                  </ThemedText>
                </View>
              ))}
            </View>

            {nextNode ? (
              <Button title={`Continue: ${getNodeTitle(nextNode)}`} accent="home" onPress={continueNext} />
            ) : (
              <ThemedText variant="body" color="labelSecondary">
                All caught up — great work! 🎉
              </ThemedText>
            )}
          </>
        ) : (
          <ThemedText variant="body" color="labelSecondary">
            No path assigned yet — your teacher will add one soon.
          </ThemedText>
        )}
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
  rewardStar: {
    fontSize: 28,
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
});
