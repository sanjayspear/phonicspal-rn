import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import { useAccessibilityPrefs } from './accessibility';

export interface RewardBurstProps {
  // Flip this to a new value (e.g. a counter) each time a reward should pop.
  trigger: number;
  children: React.ReactNode;
}

// A bouncy scale+rotate pop for star/sticker rewards — see §2.1 finding 5 /
// §2.2 fix. Pair with a matching pre-rendered audio cue at the call site
// (reuse the v1 audio pipeline), this component only does motion.
export function RewardBurst({ trigger, children }: RewardBurstProps) {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const { reduceMotion } = useAccessibilityPrefs();

  useEffect(() => {
    if (trigger === 0 || reduceMotion) return;
    scale.value = withSequence(
      withSpring(1.5, { damping: 4, stiffness: 240 }),
      withSpring(1, { damping: 6, stiffness: 200 })
    );
    rotate.value = withSequence(
      withSpring(-12, { damping: 3, stiffness: 240 }),
      withSpring(12, { damping: 3, stiffness: 240 }),
      withSpring(0, { damping: 5, stiffness: 200 })
    );
  }, [trigger, reduceMotion, scale, rotate]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotateZ: `${rotate.value}deg` }],
  }));

  return <Animated.View style={[styles.wrap, style]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
