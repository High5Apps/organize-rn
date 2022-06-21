import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleProp, ViewStyle } from 'react-native';

type Props = {
  delay: number;
  style?: StyleProp<ViewStyle>;
};

export default function DelayedActivityIndicator({ delay, style }: Props) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setAnimating(true);
    }, delay);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <ActivityIndicator animating={animating} style={style} />
  );
}

DelayedActivityIndicator.defaultProps = {
  style: {},
};
