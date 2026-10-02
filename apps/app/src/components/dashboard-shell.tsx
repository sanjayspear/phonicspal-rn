import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import {
  BottomNav,
  ThemedText,
  colors,
  sectionColors,
  spacing,
  useScheme,
  withAlpha,
  type SectionId,
} from '@phonicspal/ui';

import { useAuth } from '@/hooks/use-auth';

const NAV_SECTIONS: { section: SectionId; title: string; icon: string }[] = [
  { section: 'home', title: 'Home', icon: '🏠' },
  { section: 'phonics', title: 'Phonics', icon: '🔤' },
  { section: 'read', title: 'Read', icon: '📖' },
  { section: 'books', title: 'Books', icon: '📚' },
  { section: 'vocab', title: 'Vocab', icon: '⭐' },
];

export interface DashboardShellProps {
  gradientAccent: SectionId;
  title: string;
  children: React.ReactNode;
}

// Shared chrome (gradient wash, header + log out, bottom nav) across all
// three role dashboards — see docs/DESIGN.md §1.2. The body content is the
// only thing that differs per role.
export function DashboardShell({ gradientAccent, title, children }: DashboardShellProps) {
  const scheme = useScheme();
  const { session, logOut } = useAuth();
  const [active, setActive] = useState<SectionId>('home');

  // BottomNav previously only updated this highlight state — tapping
  // Phonics/Read/Books/Vocab visibly selected the pill but never actually
  // took you anywhere, which reads as "the buttons don't work."
  function handleNavChange(section: SectionId) {
    setActive(section);
    if (section !== 'home') router.push(`/${section}`);
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[withAlpha(sectionColors[gradientAccent], 0.16), colors[scheme].background]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <View>
              <ThemedText variant="title">{title}</ThemedText>
              {session ? (
                <ThemedText variant="body" color="labelSecondary">
                  {session.email} · {session.role}
                </ThemedText>
              ) : null}
            </View>
            <View style={styles.headerActions}>
              <Pressable
                onPress={() => router.push('/settings')}
                accessibilityRole="button"
                accessibilityLabel="Settings"
                hitSlop={8}
              >
                <Text style={styles.gear}>⚙️</Text>
              </Pressable>
              <Pressable
                onPress={async () => {
                  await logOut();
                  router.replace('/sign-up');
                }}
                accessibilityRole="button"
              >
                <ThemedText variant="label" color="labelSecondary" style={styles.logOut}>
                  Log out
                </ThemedText>
              </Pressable>
            </View>
          </View>

          {children}
        </ScrollView>

        <BottomNav
          items={NAV_SECTIONS.map(({ section, title: label, icon }) => ({
            section,
            label,
            icon: <Text>{icon}</Text>,
          }))}
          active={active}
          onChange={handleNavChange}
        />
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
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  gear: {
    fontSize: 20,
  },
  logOut: {
    textDecorationLine: 'underline',
  },
});
