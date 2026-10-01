import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './ThemedText';
import { colors, minTouchTarget, radii, sectionColors, spacing, type SectionId } from './tokens';
import { useScheme } from './useScheme';

export interface SectionCardProps {
  section: SectionId;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
}

// Gives each top-level section a consistent accent (color + icon slot) used
// in its card, so color becomes a wayfinding cue — see §2.1 finding 4 /
// §2.2 fix in the design doc.
export function SectionCard({ section, title, subtitle, icon, onPress }: SectionCardProps) {
  const scheme = useScheme();
  const accent = sectionColors[section];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors[scheme].surface,
          borderColor: colors[scheme].border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={[styles.accentBar, { backgroundColor: accent }]} />
      <View style={styles.iconSlot}>{icon}</View>
      <View style={styles.text}>
        <ThemedText variant="subtitle" style={{ color: accent }}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText variant="body" color="labelSecondary">
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.lg,
    borderWidth: 1,
    minHeight: minTouchTarget + spacing.md,
    overflow: 'hidden',
    paddingRight: spacing.lg,
  },
  accentBar: {
    width: 8,
    alignSelf: 'stretch',
  },
  iconSlot: {
    width: minTouchTarget,
    height: minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
});
