import React, { PropsWithChildren, useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

type Props = {
  delay?: number;
  style?: ViewStyle;
};

export default function FadeInView({
  children, delay = 0, style = {},
}: PropsWithChildren<Props>) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(
      opacity,
      {
        delay,
        duration: 1000,
        toValue: 1,
        useNativeDriver: true,
      },
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={{
        ...style,
        opacity,
      }}
    >
      {children}
    </Animated.View>
  );
}
