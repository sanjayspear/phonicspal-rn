import { RewardBurst, ThemedText } from '@phonicspal/ui';
import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { DashboardShell } from '@/components/dashboard-shell';

// The Phonics/Read/Books/Vocab section grid this screen used to render
// here was an exact duplicate of what the bottom nav bar (DashboardShell)
// already offers on every screen — tapping either one went to the same
// place, which just read as "why are there two of these?" Now this is
// just a welcome + the reward-star tap; Phonics/Read/Books/Vocab live in
// the bottom nav only.
export function SoloHome() {
  const [rewardTrigger, setRewardTrigger] = useState(0);

  return (
    <DashboardShell gradientAccent="phonics" title="PhonicsPal">
      <ThemedText variant="body" color="labelSecondary">
        Tap Phonics, Read, Books or Vocab below to explore!
      </ThemedText>

      <Pressable onPress={() => setRewardTrigger((n) => n + 1)} accessibilityRole="button">
        <RewardBurst trigger={rewardTrigger}>
          <Text style={styles.rewardStar}>⭐</Text>
        </RewardBurst>
      </Pressable>
    </DashboardShell>
  );
}

const styles = StyleSheet.create({
  rewardStar: {
    fontSize: 56,
    textAlign: 'center',
  },
});
