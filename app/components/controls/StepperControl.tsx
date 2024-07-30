import React, { Dispatch, SetStateAction, useEffect } from 'react';
import {
  StyleProp, StyleSheet, Text, View, ViewStyle,
} from 'react-native';
import useTheme from '../../Theme';
import { CircleButton } from './buttons';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      columnGap: spacing.m,
      flexDirection: 'row',
    },
    text: {
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
    },
  });

  return { styles };
};

type Props = {
  disabled?: boolean;
  max?: number;
  min?: number;
  setValue: Dispatch<SetStateAction<number>>
  style?: StyleProp<ViewStyle>;
  value: number;
};

export default function StepperControl({
  disabled, max, min, setValue, style, value,
}: Props) {
  const { styles } = useStyles();

  useEffect(() => {
    if ((max !== undefined) && (value > max)) {
      setValue(max);
    }

    if ((min !== undefined) && (value < min)) {
      setValue(min);
    }
  }, [max, min]);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{value}</Text>
      <CircleButton
        disabled={disabled || ((max !== undefined) && (value >= max))}
        iconName="add"
        onPress={() => setValue((v) => v + 1)}
      />
      <CircleButton
        disabled={disabled || ((min !== undefined) && (value <= min))}
        iconName="remove"
        onPress={() => setValue((v) => v - 1)}
      />
    </View>
  );
}

StepperControl.defaultProps = {
  disabled: false,
  max: undefined,
  min: undefined,
  style: {},
};
