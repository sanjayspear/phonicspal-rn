import { phonicsTopics, stories } from '@phonicspal/core';
import { RewardBurst, SectionCard, ThemedText, spacing, type SectionId } from '@phonicspal/ui';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { DashboardShell } from '@/components/dashboard-shell';

const SECTIONS: { section: SectionId; title: string; subtitle: string; icon: string }[] = [
  { section: 'home', title: 'Home', subtitle: "Today's word", icon: '🏠' },
  { section: 'phonics', title: 'Phonics', subtitle: `${phonicsTopics.length} topics so far`, icon: '🔤' },
  { section: 'read', title: 'Read', subtitle: `${stories.length} stories to listen to`, icon: '📖' },
  { section: 'books', title: 'Books', subtitle: 'Upload a .txt to listen to', icon: '📚' },
  { section: 'vocab', title: 'Vocab', subtitle: 'Saved words', icon: '⭐' },
];

export function SoloHome() {
  const [rewardTrigger, setRewardTrigger] = useState(0);

  return (
    <DashboardShell gradientAccent="phonics" title="PhonicsPal">
      <ThemedText variant="body" color="labelSecondary">
        Tap Phonics, Read, Books or Vocab to explore!
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
              if (item.section === 'phonics') router.push('/phonics');
              else if (item.section === 'vocab') router.push('/vocab');
              else if (item.section === 'read') router.push('/read');
              else if (item.section === 'books') router.push('/books');
              else setRewardTrigger((n) => n + 1);
            }}
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
