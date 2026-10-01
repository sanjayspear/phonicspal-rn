import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from './ThemedText';
import { colors, minTouchTarget, sectionColors, spacing, type SectionId } from './tokens';
import { useScheme } from './useScheme';

export interface BottomNavItem {
  section: SectionId;
  label: string;
  icon?: React.ReactNode;
}

export interface BottomNavProps {
  items: BottomNavItem[];
  active: SectionId;
  onChange: (section: SectionId) => void;
}

// Docked to the safe area instead of `position: fixed`/`absolute` with a
// hardcoded offset — avoids drifting over notches/gesture bars and
// competing with the keyboard. See §2.1 finding 2 / §2.2 fix.
export function BottomNav({ items, active, onChange }: BottomNavProps) {
  const scheme = useScheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: colors[scheme].surface,
          borderTopColor: colors[scheme].border,
          paddingBottom: Math.max(insets.bottom, spacing.sm),
        },
      ]}
    >
      {items.map((item) => {
        const isActive = item.section === active;
        const accent = sectionColors[item.section];
        return (
          <Pressable
            key={item.section}
            onPress={() => onChange(item.section)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            style={styles.item}
          >
            <View style={styles.icon}>{item.icon}</View>
            <ThemedText
              variant="label"
              style={{ color: isActive ? accent : colors[scheme].labelSecondary }}
            >
              {item.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: spacing.sm,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: minTouchTarget,
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
