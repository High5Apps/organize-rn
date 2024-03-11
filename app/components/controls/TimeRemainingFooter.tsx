import React, { useState } from 'react';
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
  endTime: Date;
  timeRemainingOptions?: TimeRemainingOptions;
  style?: StyleProp<ViewStyle>;
};

export default function TimeRemainingFooter({
  endTime, style, timeRemainingOptions,
}: Props) {
  const [now, setNow] = useState<Date>(new Date());
  const updateTime = () => setNow(new Date());

  const { styles } = useStyles();

  return (
    <Text style={[styles.timeRemaining, style]} onPress={updateTime}>
      {getTimeRemaining(endTime, { ...timeRemainingOptions, now })}
    </Text>
  );
}

TimeRemainingFooter.defaultProps = {
  timeRemainingOptions: {},
  style: {},
};
