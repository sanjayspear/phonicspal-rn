import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { RewardBurst, SectionCard, ThemedText, spacing, type SectionId } from '@phonicspal/ui';

import { DashboardShell } from '@/components/dashboard-shell';

const SECTIONS: { section: SectionId; title: string; subtitle: string; icon: string }[] = [
  { section: 'home', title: 'Home', subtitle: "Today's word", icon: '🏠' },
  { section: 'phonics', title: 'Phonics', subtitle: '62 topics to explore', icon: '🔤' },
  { section: 'read', title: 'Read', subtitle: 'Listen and follow along', icon: '📖' },
  { section: 'books', title: 'Books', subtitle: 'Your library', icon: '📚' },
  { section: 'vocab', title: 'Vocab', subtitle: 'Saved words', icon: '⭐' },
];

export function SoloHome() {
  const [rewardTrigger, setRewardTrigger] = useState(0);

  return (
    <DashboardShell gradientAccent="phonics" title="PhonicsPal">
      <ThemedText variant="body" color="labelSecondary">
        Tap a section to see the reward pop!
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
            onPress={() => setRewardTrigger((n) => n + 1)}
          />
        ))}
      </View>
    </DashboardShell>
  );
}

const styles = StyleSheet.create({
  rewardStar: {
    fontSize: 56,
    textAlign: 'center',
  },
  cards: {
    gap: spacing.md,
  },
  cardIcon: {
    fontSize: 28,
  },
});
