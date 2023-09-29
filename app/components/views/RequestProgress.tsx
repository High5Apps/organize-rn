import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator, StyleProp, StyleSheet, Text, View, ViewStyle,
} from 'react-native';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    error: {
      color: colors.error,
    },
    info: {
      color: colors.labelSecondary,
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

type ResultType = 'error' | 'none' | 'success' | 'warning' | 'info';

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

  type Props = {
    style?: StyleProp<ViewStyle>;
  };

  const RequestProgress = useCallback(({ style }: Props) => {
    const isVisible = (resultType !== 'none') || loading;
    return (
      <View style={isVisible && style}>
        {loading && <ActivityIndicator />}
        {resultMessage && (
          <Text
            style={[
              styles.message,
              (resultType === 'error') && styles.error,
              (resultType === 'success') && styles.success,
              (resultType === 'warning') && styles.error,
              (resultType === 'info') && styles.info,
            ]}
          >
            {resultMessage}
          </Text>
        )}
      </View>
    );
  }, [loading, resultMessage, resultType]);

  return {
    loading,
    RequestProgress,
    result: resultType,
    setLoading,
    setResult,
  };
}
