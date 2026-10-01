import { StyleSheet, View } from 'react-native';

import { radii, sectionColors, withAlpha, type SectionId } from './tokens';

export interface ProgressBarProps {
  progress: number; // 0-1
  accent?: SectionId;
}

export function ProgressBar({ progress, accent = 'phonics' }: ProgressBarProps) {
  const color = sectionColors[accent];
  const clamped = Math.max(0, Math.min(1, progress));

  return (
    <View
      style={[styles.track, { backgroundColor: withAlpha(color, 0.15) }]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
    >
      <View style={[styles.fill, { width: `${clamped * 100}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 12,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radii.pill,
  },
});
