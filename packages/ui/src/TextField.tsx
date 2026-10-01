import { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from './ThemedText';
import { colors, minTouchTarget, radii, sectionColors, spacing } from './tokens';
import { useScheme } from './useScheme';

export interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export function TextField({ label, error, style, onFocus, onBlur, ...rest }: TextFieldProps) {
  const scheme = useScheme();
  const [focused, setFocused] = useState(false);
  const borderColor = error ? '#B91C1C' : focused ? sectionColors.phonics : colors[scheme].border;

  return (
    <View style={styles.wrap}>
      <ThemedText variant="label" color="labelSecondary">
        {label}
      </ThemedText>
      <TextInput
        placeholderTextColor={colors[scheme].labelSecondary}
        style={[
          styles.input,
          {
            borderColor,
            color: colors[scheme].label,
            backgroundColor: colors[scheme].surface,
          },
          style,
        ]}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      {error ? (
        <ThemedText variant="body" style={styles.error}>
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs,
  },
  input: {
    minHeight: minTouchTarget,
    borderWidth: 2,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    fontSize: 17,
  },
  error: {
    color: '#B91C1C',
  },
});
