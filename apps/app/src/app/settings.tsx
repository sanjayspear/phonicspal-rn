import {
  Button,
  ThemedText,
  colors,
  radii,
  sectionColors,
  spacing,
  useScheme,
  withAlpha,
} from '@phonicspal/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { useAuth } from '@/hooks/use-auth';
import { useSettings } from '@/hooks/use-settings';

export default function SettingsScreen() {
  const scheme = useScheme();
  const { session, logOut } = useAuth();
  const { highContrast, reduceMotion, setHighContrast, setReduceMotion } = useSettings();

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[withAlpha(sectionColors.vocab, 0.16), colors[scheme].background]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <ScreenHeader title="Settings" />

          <View style={styles.sectionHeader}>
            <ThemedText variant="subtitle">Account</ThemedText>
          </View>
          <View style={[styles.card, { backgroundColor: colors[scheme].background }]}>
            {session ? (
              <ThemedText variant="body" color="labelSecondary">
                {session.email} · {session.role}
              </ThemedText>
            ) : null}
            <Button
              title="Log out"
              variant="secondary"
              accent="vocab"
              onPress={async () => {
                await logOut();
                router.replace('/sign-up');
              }}
            />
          </View>

          <View style={styles.sectionHeader}>
            <ThemedText variant="subtitle">Accessibility</ThemedText>
          </View>
          <View style={[styles.card, { backgroundColor: colors[scheme].background }]}>
            <SettingRow
              title="High contrast"
              description="Makes secondary/gray text darker and easier to read."
              value={highContrast}
              onValueChange={setHighContrast}
            />
            <SettingRow
              title="Reduce motion"
              description="Turns off the bouncy star/sticker reward animation."
              value={reduceMotion}
              onValueChange={setReduceMotion}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function SettingRow({
  title,
  description,
  value,
  onValueChange,
}: {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <ThemedText variant="body">{title}</ThemedText>
        <ThemedText variant="body" color="labelSecondary">
          {description}
        </ThemedText>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: sectionColors.vocab }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  sectionHeader: {
    marginTop: spacing.sm,
  },
  card: {
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rowText: {
    flex: 1,
    gap: spacing.xs,
  },
});
