import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing, runOnJS, useSharedValue, withTiming, WithTimingConfig,
} from 'react-native-reanimated';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors, spacing } = useTheme();

  const styles = StyleSheet.create({
    horizontal: {
      height: spacing.s,
    },
    line: {
      backgroundColor: colors.primary,
      position: 'absolute',
    },
    vertical: {
      width: spacing.s,
    },
  });
  return { styles };
};

type Props = {
  duration: number;
  onFinished?: () => void;
  sideLength: number;
};

export default function CountdownClockBorder({
  duration, onFinished = () => {}, sideLength,
}: Props) {
  const halfSideLength = sideLength / 2;
  const topRight = useSharedValue(halfSideLength);
  const right = useSharedValue(0);
  const bottom = useSharedValue(0);
  const left = useSharedValue(0);
  const topLeft = useSharedValue(0);

  useEffect(() => {
    if (!sideLength) { return; }

    const sideDuration = duration / 4;
    const halfSideDuration = sideDuration / 2;
    const sideConfig: WithTimingConfig = {
      duration: sideDuration,
      easing: Easing.linear,
    };
    const halfSideConfig: WithTimingConfig = {
      ...sideConfig,
      duration: halfSideDuration,
    };

    topRight.value = withTiming(sideLength, halfSideConfig, (topRightDone) => {
      if (!topRightDone) { return; }
      right.value = withTiming(sideLength, sideConfig, (rightDone) => {
        if (!rightDone) { return; }
        bottom.value = withTiming(sideLength, sideConfig, (bottomDone) => {
          if (!bottomDone) { return; }
          left.value = withTiming(sideLength, sideConfig, (leftDone) => {
            if (!leftDone) { return; }
            topLeft.value = withTiming(
              halfSideLength,
              halfSideConfig,
              (topLeftDone) => {
                if (!topLeftDone) { return; }
                runOnJS(onFinished)();
              },
            );
          });
        });
      });
    });
  }, [duration, onFinished, sideLength]);

  const { styles } = useStyles();

  return (
    <>
      <Animated.View
        style={[
          styles.line,
          styles.horizontal,
          { left: topRight, right: 0, top: 0 },
        ]}
      />
      <Animated.View
        style={[
          styles.line,
          styles.vertical,
          { bottom: 0, right: 0, top: right },
        ]}
      />
      <Animated.View
        style={[
          styles.line,
          styles.horizontal,
          { bottom: 0, left: 0, right: bottom },
        ]}
      />
      <Animated.View
        style={[
          styles.line,
          styles.vertical,
          { bottom: left, left: 0, top: 0 },
        ]}
      />
      <Animated.View
        style={[
          styles.line,
          styles.horizontal,
          { left: topLeft, right: halfSideLength, top: 0 },
        ]}
      />
    </>
  );
}
