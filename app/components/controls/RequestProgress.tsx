import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator, StyleProp, StyleSheet, Text, View, ViewStyle,
} from 'react-native';
import useTheme from '../../Theme';
import type { ResultType } from './types';

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

  return { colors, styles };
};

type SetResultOptions = {
  message?: string;
  onPress?: () => void;
};

export default function useRequestProgress() {
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [resultOnPress, setResultOnPress] = useState<() => void>();
  const [resultType, setResultType] = useState<ResultType>('none');

  function setResult(type: ResultType, {
    message, onPress,
  }: SetResultOptions = {}) {
    // In order to store a function in useState, you must pass a function that
    // creates the function. Passing just the onPress would make the useState
    // think that it was an updater function. For more info, see:
    // https://stackoverflow.com/a/55621325/2421313
    setResultOnPress(() => onPress);

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

  const { colors, styles } = useStyles();

  type Props = {
    style?: StyleProp<ViewStyle>;
  };

  const RequestProgress = useCallback(({ style }: Props) => {
    const isVisible = (resultType !== 'none') || loading;
    return (
      <View style={isVisible && style}>
        {loading && <ActivityIndicator color={colors.primary} />}
        {resultMessage && (
          <Text
            onPress={resultOnPress}
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
  }, [loading, resultMessage, resultOnPress, resultType]);

  return {
    loading,
    RequestProgress,
    result: resultType,
    setLoading,
    setResult,
  };
}
