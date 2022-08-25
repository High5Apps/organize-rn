import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    error: {
      color: colors.error,
    },
    message: {
      fontFamily: font.weights.regular,
      fontSize: font.sizes.body,
      paddingHorizontal: spacing.m,
      textAlign: 'center',
    },
    success: {
      color: colors.success,
    },
  });

  return { styles };
};

type ResultType = 'error' | 'none' | 'success';

export default function useRequestProgress() {
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [resultType, setResultType] = useState<ResultType>('none');

  function setResult(type: ResultType, message?: string) {
    setResultType(type);

    if (type !== 'none') {
      setLoading(false);
    }

    if (message) {
      setResultMessage(message);
    } else {
      setResultMessage(null);
    }
  }

  const { styles } = useStyles();

  const RequestProgress = () => (
    <>
      {loading && <ActivityIndicator />}
      {resultMessage && (
        <Text
          style={[
            styles.message,
            (resultType === 'error') && styles.error,
            (resultType === 'success') && styles.success,
          ]}
        >
          {resultMessage}
        </Text>
      )}
    </>
  );

  return {
    RequestProgress,
    setLoading,
    setResult,
  };
}
