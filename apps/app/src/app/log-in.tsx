import type { Role } from '@phonicspal/core';
import {
  Button,
  ThemedText,
  TextField,
  colors,
  radii,
  sectionColors,
  spacing,
  useScheme,
  withAlpha,
} from '@phonicspal/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DEMO_ACCOUNTS, useAuth } from '@/hooks/use-auth';

// Same role -> accent mapping RoleTile uses at sign-up, so a demo button
// here reads as "the same Teacher/Parent/Solo" rather than new colors.
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

export default function LogInScreen() {
  const scheme = useScheme();
  const { logIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [demoSubmitting, setDemoSubmitting] = useState<Role | null>(null);

  const canSubmit = /\S+@\S+\.\S+/.test(email) && password.length > 0;

  async function handleSubmit() {
    if (!canSubmit) {
      setError('Enter your email and password.');
      return;
    }
    setError(null);
    setSubmitting(true);
    await logIn(email);
    setSubmitting(false);
    router.replace('/');
  }

  async function handleDemoLogin(demoEmail: string, role: Role) {
    setDemoSubmitting(role);
    await logIn(demoEmail);
    setDemoSubmitting(null);
    router.replace('/');
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[withAlpha(sectionColors.vocab, 0.16), colors[scheme].background]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ThemedText variant="title">Welcome back</ThemedText>

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
              placeholder="Your password"
            />
          </View>

          {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

          <Button title="Log in" onPress={handleSubmit} loading={submitting} />

          <Link href="/sign-up" style={styles.link}>
            <ThemedText variant="body" color="labelSecondary">
              New here? <ThemedText style={styles.linkText}>Create an account</ThemedText>
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
