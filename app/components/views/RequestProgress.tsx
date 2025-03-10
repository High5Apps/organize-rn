import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle,
} from 'react-native';
import useTheme from '../../Theme';
import { getErrorMessage } from '../../model';

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
    warning: {
      color: colors.warning,
    },
  });

  return { colors, styles };
};

type SetResultOptions = {
  error?: unknown;
  message?: string;
  onPress?: () => void;
};

export type ResultType = 'error' | 'none' | 'success' | 'warning' | 'info';

type Props = {
  removeWhenInactive?: boolean;
};

export default function useRequestProgress({ removeWhenInactive }: Props = {}) {
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [resultOnPress, setResultOnPress] = useState<() => void>();
  const [resultType, setResultType] = useState<ResultType>('none');

  function setResult(type: ResultType, {
    error, message, onPress,
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

    if (error) {
      setResultMessage(getErrorMessage(error));
    } else if (message) {
      setResultMessage(message);
    } else {
      setResultMessage(null);
    }
  }

  const { colors, styles } = useStyles();

  type RequestProgressProps = {
    messageStyle?: StyleProp<TextStyle>;
    style?: StyleProp<ViewStyle>;
  };

  const RequestProgress = useCallback(({
    messageStyle, style,
  }: RequestProgressProps) => {
    const isVisible = (resultType !== 'none') || loading;
    const remove = removeWhenInactive && !isVisible;
    return remove ? null : (
      <View style={isVisible && style}>
        {loading && <ActivityIndicator color={colors.primary} />}
        {resultMessage && (
          <Text
            onPress={resultOnPress}
            style={[
              styles.message,
              (resultType === 'error') && styles.error,
              (resultType === 'success') && styles.success,
              (resultType === 'warning') && styles.warning,
              (resultType === 'info') && styles.info,
              messageStyle,
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
