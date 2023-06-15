import React, { useEffect, useRef } from 'react';
import {
  Animated, Easing, StyleSheet, View,
} from 'react-native';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors, spacing } = useTheme();

  const styles = StyleSheet.create({
    progress: {
      backgroundColor: colors.primary,
      ...StyleSheet.absoluteFillObject,
    },
    track: {
      backgroundColor: `${colors.primary}40`, // 25% opacity in hex
      height: spacing.xs,
    },
  });
  return { styles };
};

type Props = {
  progress: number;
};

export default function ProgressBar({ progress }: Props) {
  const { styles } = useStyles();

  const width = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(width, {
      duration: 100,
      easing: Easing.linear,
      toValue: progress,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  if (progress <= 0 || progress >= 1) {
    return null;
  }

  return (
    <View style={styles.track}>
      <Animated.View
        style={
          [
            styles.progress,
            {
              width: width.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]
        }
      />
    </View>
  );
}
