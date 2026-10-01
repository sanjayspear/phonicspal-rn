import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './ThemedText';
import { colors, minTouchTarget, radii, sectionColors, spacing, withAlpha, type SectionId } from './tokens';
import { useScheme } from './useScheme';

export interface SectionCardProps {
  section: SectionId;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
}

// A colorful icon "badge" + a soft accent-tinted shadow give each section
// a distinct, tappable identity — see §2.1 finding 4 / §2.2 fix in the
// design doc, taken further for the playful/bright visual pass.
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
          backgroundColor: colors[scheme].background,
          shadowColor: accent,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View style={[styles.badge, { backgroundColor: accent }]}>{icon}</View>
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
      <View style={[styles.chevron, { backgroundColor: withAlpha(accent, 0.1) }]}>
        <ThemedText style={{ color: accent }}>→</ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.xl,
    minHeight: minTouchTarget + spacing.lg,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    ...Platform.select({
      web: { boxShadow: '0 10px 24px -8px rgba(0,0,0,0.18)' },
      default: {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
        elevation: 4,
      },
    }),
  },
  badge: {
    width: minTouchTarget,
    height: minTouchTarget,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: spacing.xs,
  },
  chevron: {
    width: 32,
    height: 32,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
