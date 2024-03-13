/* eslint-disable react/require-default-props */
import React, { useMemo, useState } from 'react';
import {
  StyleProp, StyleSheet, Text, ViewStyle,
} from 'react-native';
import useTheme from '../../Theme';
import { TimeRemainingOptions, getTimeRemaining } from '../../model';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    timeRemaining: {
      color: colors.labelSecondary,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
      margin: spacing.m,
      textAlign: 'center',
    },
  });

  return { styles };
};

type Props = {
  endTime?: Date | null;
  style?: StyleProp<ViewStyle>;
  timeRemainingOptions?: TimeRemainingOptions;
};

export default function useTimeRemainingFooter() {
  const [now, setNow] = useState<Date>(new Date());
  const refreshTimeRemaining = () => setNow(new Date());

  const { styles } = useStyles();

  const TimeRemainingFooter = useMemo(() => ({
    endTime, style, timeRemainingOptions,
  }: Props) => {
    if (!endTime) { return null; }
    return (
      <Text
        style={[styles.timeRemaining, style]}
        onPress={refreshTimeRemaining}
      >
        {getTimeRemaining(endTime, { ...timeRemainingOptions, now })}
      </Text>
    );
  }, [now]);
  return { TimeRemainingFooter, refreshTimeRemaining };
}
