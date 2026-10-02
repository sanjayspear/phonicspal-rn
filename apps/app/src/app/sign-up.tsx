import type { Role } from '@phonicspal/core';
import {
  Button,
  RoleTile,
  ThemedText,
  TextField,
  colors,
  sectionColors,
  spacing,
  useScheme,
  withAlpha,
} from '@phonicspal/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DEMO_ACCOUNTS, useAuth } from '@/hooks/use-auth';

const ROLES: { role: Role; title: string; description: string; icon: string }[] = [
  { role: 'teacher', title: 'Teacher', description: 'Assign and track a class', icon: '🧑‍🏫' },
  { role: 'parent', title: 'Parent', description: "Guide your child's practice", icon: '👪' },
  { role: 'solo', title: 'Just me', description: 'Free play, no roster', icon: '🚀' },
];

// Same role -> accent mapping RoleTile uses above, so a demo button reads
// as "the same Teacher/Parent/Solo" rather than new colors.
const DEMO_ACCENT: Record<Role, 'phonics' | 'home' | 'vocab'> = {
  teacher: 'phonics',
  parent: 'home',
  solo: 'vocab',
};
const DEMO_LABEL: Record<Role, string> = {
  teacher: 'Teacher',
  parent: 'Parent',
  solo: 'Just me',
};

export default function SignUpScreen() {
  const scheme = useScheme();
  const { signUp, logIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [demoSubmitting, setDemoSubmitting] = useState<Role | null>(null);

  const canSubmit = /\S+@\S+\.\S+/.test(email) && password.length >= 6 && role !== null;

  async function handleSubmit() {
    if (!canSubmit || !role) {
      setError(
        !role
          ? 'Pick a role to continue.'
          : 'Enter a valid email and a password of at least 6 characters.'
      );
      return;
    }
    setError(null);
    setSubmitting(true);
    await signUp(email, role);
    setSubmitting(false);
    router.replace('/');
  }

  async function handleDemoLogin(demoEmail: string, demoRole: Role) {
    setDemoSubmitting(demoRole);
    await logIn(demoEmail);
    setDemoSubmitting(null);
    router.replace('/');
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[withAlpha(sectionColors.home, 0.16), colors[scheme].background]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ThemedText variant="title">Create your account</ThemedText>
          <ThemedText variant="body" color="labelSecondary">
            Takes under a minute — no card, no spam.
          </ThemedText>

          <View style={styles.fields}>
            <TextField
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@example.com"
            />
            <TextField
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="At least 6 characters"
            />
          </View>

          <View style={styles.roleSection}>
            <ThemedText variant="label" color="labelSecondary">
              I am a…
            </ThemedText>
            <View style={styles.roleRow}>
              {ROLES.map((r) => (
                <RoleTile
                  key={r.role}
                  role={r.role}
                  title={r.title}
                  description={r.description}
                  icon={<Text style={styles.roleIcon}>{r.icon}</Text>}
                  selected={role === r.role}
                  onPress={() => setRole(r.role)}
                />
              ))}
            </View>
          </View>

          {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

          <Button title="Create account" onPress={handleSubmit} loading={submitting} />

          <Link href="/log-in" style={styles.link}>
            <ThemedText variant="body" color="labelSecondary">
              Already have an account? <ThemedText style={styles.linkText}>Log in</ThemedText>
            </ThemedText>
          </Link>

          <View style={styles.demoSection}>
            <ThemedText variant="label" color="labelSecondary">
              TRY IT NOW — NO ACCOUNT NEEDED
            </ThemedText>
            <ThemedText variant="body" color="labelSecondary">
              Jump straight into any role with a temporary demo account.
            </ThemedText>
            <View style={styles.demoRow}>
              {DEMO_ACCOUNTS.map((account) => (
                <Button
                  key={account.role}
                  title={DEMO_LABEL[account.role]}
                  variant="secondary"
                  accent={DEMO_ACCENT[account.role]}
                  loading={demoSubmitting === account.role}
                  onPress={() => handleDemoLogin(account.email, account.role)}
                />
              ))}
            </View>
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
    gap: spacing.lg,
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },
  fields: {
    gap: spacing.md,
  },
  roleSection: {
    gap: spacing.sm,
  },
  roleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  roleIcon: {
    fontSize: 26,
  },
  error: {
    color: '#B91C1C',
  },
  link: {
    alignSelf: 'center',
    marginTop: spacing.sm,
  },
  linkText: {
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  demoSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
    gap: spacing.sm,
  },
  demoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
