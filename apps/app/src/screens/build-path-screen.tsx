import { getNodeTitle, phonicsTopics, type LearningPathNode } from '@phonicspal/core';
import {
  Button,
  TextField,
  ThemedText,
  colors,
  radii,
  sectionColors,
  spacing,
  useScheme,
  withAlpha,
} from '@phonicspal/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader, goBack } from '@/components/screen-header';
import { useLearningPaths } from '@/hooks/use-learning-paths';

const STATUS_ICON: Record<string, string> = {
  submitted: '✅',
  in_progress: '🔵',
  available: '⚪️',
  locked: '🔒',
  reviewed: '⭐',
};

function reindex(nodes: LearningPathNode[]): LearningPathNode[] {
  return nodes.map((n, i) => ({ ...n, order: i }));
}

function newId() {
  return `n${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

// No student picked first — this builds and publishes the one broadcast
// Learning Path for the class (docs/DESIGN.md's CR-3: "Eliminate the
// requirement for teachers to select or assign homework to specific
// student names upfront"). It reflects on every parent's dashboard the
// moment they open it; each family's own progress is created the first
// time they identify themselves there (see ChildIdentityForm).
export function BuildPathScreen() {
  const scheme = useScheme();
  const { template, publishTemplate } = useLearningPaths();

  const [nodes, setNodes] = useState<LearningPathNode[]>(
    template ? [...template.nodes].sort((a, b) => a.order - b.order) : []
  );
  const [assignmentText, setAssignmentText] = useState('');
  const [saving, setSaving] = useState(false);

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= nodes.length) return;
    const next = [...nodes];
    [next[index], next[target]] = [next[target], next[index]];
    setNodes(reindex(next));
  }

  function remove(id: string) {
    setNodes((prev) => reindex(prev.filter((n) => n.id !== id)));
  }

  function addTopic(topicId: string) {
    setNodes((prev) =>
      reindex([...prev, { id: newId(), order: 0, type: 'topic', refId: topicId, status: 'locked' }])
    );
  }

  function addAssignment() {
    const text = assignmentText.trim();
    if (!text) return;
    setNodes((prev) =>
      reindex([...prev, { id: newId(), order: 0, type: 'assignment', refId: text, status: 'locked' }])
    );
    setAssignmentText('');
  }

  async function publish() {
    setSaving(true);
    await publishTemplate(nodes);
    setSaving(false);
    goBack();
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[withAlpha(sectionColors.phonics, 0.16), colors[scheme].background]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <ScreenHeader title="Build a Learning Path" />
          <ThemedText variant="body" color="labelSecondary">
            Publishing sends this to every parent's dashboard — no student picked, no roster to
            manage.
          </ThemedText>

          <View style={styles.sectionHeader}>
            <ThemedText variant="subtitle">Steps</ThemedText>
          </View>

          {nodes.length === 0 ? (
            <ThemedText variant="body" color="labelSecondary">
              No steps yet — add a topic or assignment below.
            </ThemedText>
          ) : (
            <View style={styles.list}>
              {nodes.map((node, index) => (
                <View key={node.id} style={[styles.nodeCard, { backgroundColor: colors[scheme].background }]}>
                  <Text style={styles.nodeIcon}>{STATUS_ICON[node.status]}</Text>
                  <ThemedText variant="body" style={styles.nodeTitle}>
                    {getNodeTitle(node)}
                  </ThemedText>
                  <View style={styles.nodeActions}>
                    <Pressable onPress={() => move(index, -1)} hitSlop={6} accessibilityLabel="Move up">
                      <Text style={styles.actionIcon}>↑</Text>
                    </Pressable>
                    <Pressable onPress={() => move(index, 1)} hitSlop={6} accessibilityLabel="Move down">
                      <Text style={styles.actionIcon}>↓</Text>
                    </Pressable>
                    <Pressable onPress={() => remove(node.id)} hitSlop={6} accessibilityLabel="Remove">
                      <Text style={styles.actionIcon}>✕</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={styles.sectionHeader}>
            <ThemedText variant="subtitle">Add a Phonics Topic</ThemedText>
          </View>
          <View style={styles.chipRow}>
            {phonicsTopics.map((topic) => (
              <Pressable
                key={topic.id}
                onPress={() => addTopic(topic.id)}
                style={[styles.chip, { borderColor: sectionColors.phonics }]}
              >
                <Text style={styles.chipIcon}>{topic.icon}</Text>
                <ThemedText variant="body" style={{ color: sectionColors.phonics }}>
                  {topic.name}
                </ThemedText>
              </Pressable>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <ThemedText variant="subtitle">Add a standalone assignment</ThemedText>
          </View>
          <View style={styles.assignmentRow}>
            <View style={styles.assignmentField}>
              <TextField
                label="Instructions"
                value={assignmentText}
                onChangeText={setAssignmentText}
                placeholder="e.g. Read 3 pages aloud"
              />
            </View>
            <Button title="Add" accent="phonics" onPress={addAssignment} />
          </View>

          <Button title="Publish path" accent="home" onPress={publish} loading={saving} disabled={nodes.length === 0} />
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
    maxWidth: 700,
    alignSelf: 'center',
    width: '100%',
  },
  sectionHeader: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  list: {
    gap: spacing.sm,
  },
  nodeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  nodeIcon: {
    fontSize: 16,
  },
  nodeTitle: {
    flex: 1,
  },
  nodeActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionIcon: {
    fontSize: 16,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 2,
    borderRadius: radii.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  chipIcon: {
    fontSize: 16,
  },
  assignmentRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  assignmentField: {
    flex: 1,
  },
});
