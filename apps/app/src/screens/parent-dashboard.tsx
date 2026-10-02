import { getNodeTitle } from '@phonicspal/core';
import { Avatar, Button, ProgressBar, RewardBurst, ThemedText, colors, radii, spacing, useScheme } from '@phonicspal/ui';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ChildIdentityForm } from '@/components/child-identity-form';
import { DashboardShell } from '@/components/dashboard-shell';
import { useActivity } from '@/hooks/use-activity';
import { useChildIdentity } from '@/hooks/use-child-identity';
import { useLearningPaths } from '@/hooks/use-learning-paths';

const STATUS_ICON: Record<string, string> = {
  submitted: '✅',
  in_progress: '🔵',
  available: '⚪️',
  locked: '🔒',
  reviewed: '⭐',
};

export function ParentDashboard() {
  const scheme = useScheme();
  const { template, getPath, savePath, submitNode } = useLearningPaths();
  const { addEvent } = useActivity();
  const { identity, saveIdentity } = useChildIdentity();

  const path = identity ? getPath(identity.studentId) : undefined;

  // First time this family's identified themselves against a published
  // template, there's no per-student progress record yet — clone the
  // template's nodes into one (see use-learning-paths.tsx's header for why
  // this lives separately from the template). Only runs once per
  // identity/template pair; afterwards getPath finds the real record.
  useEffect(() => {
    if (!identity || !template || path) return;
    savePath({
      id: `lp-${identity.studentId}`,
      classId: template.classId,
      studentId: identity.studentId,
      createdBy: 'broadcast',
      nodes: template.nodes,
      updatedAt: new Date().toISOString(),
      studentName: identity.childName,
      className: identity.className,
      section: identity.section,
    });
  }, [identity, template, path, savePath]);

  const nodes = path ? [...path.nodes].sort((a, b) => a.order - b.order) : [];
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
    if (!nextNode || !identity) return;
    if (nextNode.type === 'topic') {
      // Deep-link into the real topic screen in guided mode — it shows the
      // "for grown-ups" tip and a Submit button, and submits from there
      // (docs/DESIGN.md §4.3), instead of marking it done sight-unseen.
      router.push(`/phonics/${nextNode.refId}?pathNodeId=${nextNode.id}&studentId=${identity.studentId}`);
      return;
    }
    // Assignment nodes are free-text instructions with no screen of their
    // own — submit in place once the parent's done them with the child.
    submitNode(identity.studentId, nextNode.id);
    addEvent({
      studentName: identity.childName,
      studentId: identity.studentId,
      className: identity.className,
      section: identity.section,
      summary: `Submitted ${getNodeTitle(nextNode)}`,
      whenLabel: 'Just now',
    });
  }

  if (!identity) {
    return (
      <DashboardShell gradientAccent="home" title="PhonicsPal">
        <ChildIdentityForm onSubmit={saveIdentity} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell gradientAccent="home" title="PhonicsPal">
      <View style={[styles.card, { backgroundColor: colors[scheme].background }]}>
        <View style={styles.cardHeader}>
          <Avatar name={identity.childName} accent="home" size={56} />
          <View style={styles.cardHeaderText}>
            <ThemedText variant="subtitle">{identity.childName}'s Learning Path</ThemedText>
            <ThemedText variant="body" color="labelSecondary">
              {identity.className} · Section {identity.section} · ID {identity.studentId}
            </ThemedText>
            {nodes.length ? (
              <ThemedText variant="body" color="labelSecondary">
                {submittedCount} of {nodes.length} done
              </ThemedText>
            ) : null}
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
            No path assigned yet — your teacher hasn't published one.
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
