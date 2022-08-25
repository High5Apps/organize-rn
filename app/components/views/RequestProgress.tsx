import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    errorMessage: {
      color: colors.error,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.body,
      paddingHorizontal: spacing.m,
      textAlign: 'center',
    },
  });

  return { styles };
};

export default function useRequestProgress() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { styles } = useStyles();

  const RequestProgress = () => (
    <>
      {loading && <ActivityIndicator />}
      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
    </>
  );

  return {
    RequestProgress,
    setErrorMessage,
    setLoading,
  };
}
