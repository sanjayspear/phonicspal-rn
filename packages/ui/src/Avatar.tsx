import { StyleSheet, View } from 'react-native';

import { ThemedText } from './ThemedText';
import { radii, sectionColors, withAlpha, type SectionId } from './tokens';

export interface AvatarProps {
  name: string;
  accent?: SectionId;
  size?: number;
}

export function Avatar({ name, accent = 'home', size = 48 }: AvatarProps) {
  const color = sectionColors[accent];
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: withAlpha(color, 0.18) },
      ]}
    >
      <ThemedText variant="subtitle" style={{ color }}>
        {initial}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
  },
});
