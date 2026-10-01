import {
  Button,
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
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/use-auth';

export default function LogInScreen() {
  const scheme = useScheme();
  const { logIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
});
