import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
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
  const topRight = useRef(new Animated.Value(0)).current;
  const right = useRef(new Animated.Value(0)).current;
  const bottom = useRef(new Animated.Value(0)).current;
  const left = useRef(new Animated.Value(0)).current;
  const topLeft = useRef(new Animated.Value(0)).current;

  const sideDuration = duration / 4;
  const halfSideDuration = sideDuration / 2;
  const sideConfig: Animated.TimingAnimationConfig = {
    duration: sideDuration,
    easing: Easing.linear,
    toValue: 1,
    useNativeDriver: false,
  };
  const halfSideConfig: Animated.TimingAnimationConfig = {
    ...sideConfig,
    duration: halfSideDuration,
  };

  const start = () => {
    Animated.sequence([
      Animated.timing(topRight, halfSideConfig),
      Animated.timing(right, sideConfig),
      Animated.timing(bottom, sideConfig),
      Animated.timing(left, sideConfig),
      Animated.timing(topLeft, halfSideConfig),
    ]).start(({ finished }) => finished && onFinished?.());
  };

  useEffect(() => {
    if (sideLength) {
      start();
    }
  }, [sideLength]);

  const { styles } = useStyles();

  const sideInterpolationConfig: Animated.InterpolationConfigType = {
    inputRange: [0, 1],
    outputRange: [0, sideLength],
  };

  return (
    <>
      <Animated.View
        style={[
          styles.line,
          styles.horizontal,
          {
            right: 0,
            top: 0,
            left: topRight.interpolate({
              inputRange: [0, 1],
              outputRange: [sideLength / 2, sideLength],
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.line,
          styles.vertical,
          {
            bottom: 0,
            top: right.interpolate(sideInterpolationConfig),
            right: 0,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.line,
          styles.horizontal,
          {
            bottom: 0,
            left: 0,
            right: bottom.interpolate(sideInterpolationConfig),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.line,
          styles.vertical,
          {
            bottom: left.interpolate(sideInterpolationConfig),
            left: 0,
            top: 0,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.line,
          styles.horizontal,
          {
            left: topLeft.interpolate({
              inputRange: [0, 1],
              outputRange: [0, sideLength / 2],
            }),
            right: 0.5 * sideLength,
            top: 0,
          },
        ]}
      />
    </>
  );
}
