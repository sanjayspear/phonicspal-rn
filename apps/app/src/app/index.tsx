import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  BottomNav,
  RewardBurst,
  SectionCard,
  ThemedText,
  colors,
  spacing,
  useScheme,
  type SectionId,
} from '@phonicspal/ui';
import { router } from 'expo-router';

import { useAuth } from '@/hooks/use-auth';

const SECTIONS: { section: SectionId; title: string; subtitle: string; icon: string }[] = [
  { section: 'home', title: 'Home', subtitle: "Today's word", icon: '🏠' },
  { section: 'phonics', title: 'Phonics', subtitle: '62 topics to explore', icon: '🔤' },
  { section: 'read', title: 'Read', subtitle: 'Listen and follow along', icon: '📖' },
  { section: 'books', title: 'Books', subtitle: 'Your library', icon: '📚' },
  { section: 'vocab', title: 'Vocab', subtitle: 'Saved words', icon: '⭐' },
];

export default function HomeScreen() {
  const scheme = useScheme();
  const { session, logOut } = useAuth();
  const [active, setActive] = useState<SectionId>('home');
  const [rewardTrigger, setRewardTrigger] = useState(0);

  return (
    <View style={[styles.root, { backgroundColor: colors[scheme].background }]}>
      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <View>
              <ThemedText variant="title">PhonicsPal</ThemedText>
              {session ? (
                <ThemedText variant="body" color="labelSecondary">
                  {session.email} · {session.role}
                </ThemedText>
              ) : null}
            </View>
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
          <ThemedText variant="body" color="labelSecondary">
            Design system preview — tap a section to see the reward pop.
          </ThemedText>

          <RewardBurst trigger={rewardTrigger}>
            <Text style={styles.rewardStar}>⭐</Text>
          </RewardBurst>

          <View style={styles.cards}>
            {SECTIONS.map((item) => (
              <SectionCard
                key={item.section}
                section={item.section}
                title={item.title}
                subtitle={item.subtitle}
                icon={<Text style={styles.cardIcon}>{item.icon}</Text>}
                onPress={() => {
                  setActive(item.section);
                  setRewardTrigger((n) => n + 1);
                }}
              />
            ))}
          </View>
        </ScrollView>

        <BottomNav
          items={SECTIONS.map(({ section, title, icon }) => ({
            section,
            label: title,
            icon: <Text>{icon}</Text>,
          }))}
          active={active}
          onChange={setActive}
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
  rewardStar: {
    fontSize: 40,
    textAlign: 'center',
  },
  cards: {
    gap: spacing.md,
  },
  cardIcon: {
    fontSize: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logOut: {
    textDecorationLine: 'underline',
  },
});
