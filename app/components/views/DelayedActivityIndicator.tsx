import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

const useStyles = () => {
  const styles = StyleSheet.create({
    activityIndicator: {
      flex: 1,
    },
  });

  return { styles };
};

type Props = {
  delay: number;
};

export default function DelayedActivityIndicator({ delay }: Props) {
  const [animating, setAnimating] = useState(false);

  const { styles } = useStyles();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setAnimating(true);
    }, delay);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <ActivityIndicator animating={animating} style={styles.activityIndicator} />
  );
}
