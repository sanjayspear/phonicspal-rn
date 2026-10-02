import type { ChildIdentity } from '@phonicspal/core';
import { Button, TextField, ThemedText, colors, radii, spacing, useScheme } from '@phonicspal/ui';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export interface ChildIdentityFormProps {
  onSubmit: (identity: ChildIdentity) => void;
}

// The mandatory gate before a parent can start or submit any homework on
// the broadcast Learning Path (CR-3's "On-Demand Student Identification")
// — there's no pre-existing roster to pick from, so this is how the
// teacher's tracking view learns who's who.
export function ChildIdentityForm({ onSubmit }: ChildIdentityFormProps) {
  const scheme = useScheme();
  const [childName, setChildName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [error, setError] = useState<string | null>(null);

  function submit() {
    if (!childName.trim() || !studentId.trim() || !className.trim() || !section.trim()) {
      setError('All four fields are required before you can continue.');
      return;
    }
    setError(null);
    onSubmit({
      childName: childName.trim(),
      studentId: studentId.trim(),
      className: className.trim(),
      section: section.trim(),
    });
  }

  return (
    <View style={[styles.card, { backgroundColor: colors[scheme].background }]}>
      <ThemedText variant="subtitle">Who's doing this homework?</ThemedText>
      <ThemedText variant="body" color="labelSecondary">
        Your teacher needs these to match your child's progress — fill this in once.
      </ThemedText>

      <TextField label="Child's Name" value={childName} onChangeText={setChildName} placeholder="e.g. Mia" />
      <TextField label="Student ID" value={studentId} onChangeText={setStudentId} placeholder="e.g. S-1042" />
      <TextField label="Class" value={className} onChangeText={setClassName} placeholder="e.g. Grade 2" />
      <TextField label="Section" value={section} onChangeText={setSection} placeholder="e.g. A" />

      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

      <Button title="Save and continue" accent="home" onPress={submit} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.md,
  },
  error: {
    color: '#B91C1C',
  },
});
