import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export interface RewardBurstProps {
  // Flip this to a new value (e.g. a counter) each time a reward should pop.
  trigger: number;
  children: React.ReactNode;
}

// A short (<400ms) scale+fade pop for star/sticker rewards — see §2.1
// finding 5 / §2.2 fix. Pair with a matching pre-rendered audio cue at the
// call site (reuse the v1 audio pipeline), this component only does motion.
export function RewardBurst({ trigger, children }: RewardBurstProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (trigger === 0) return;
    scale.value = withSequence(
      withTiming(1.35, { duration: 150 }),
      withTiming(1, { duration: 200 })
    );
  }, [trigger, scale]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={[styles.wrap, style]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
