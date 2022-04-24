import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useTheme from '../../Theme';
import { FrameButton } from '../controls';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    frameButton: {
      backgroundColor: colors.fill,
      padding: spacing.m,
    },
    label: {
      color: colors.labelSecondary,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.body,
    },
    text: {
      textAlign: 'center',
    },
    title: {
      color: colors.label,
      fontFamily: font.weights.medium,
      fontSize: font.sizes.title1,
      textDecorationLine: 'underline',
    },
    valueContainer: {
      marginBottom: spacing.s,
    },
  });
  return { styles };
};

type LabeledValue = {
  label: string;
  value: string;
};

type Props = {
  labeledValues: LabeledValue[];
};

export default function ReviewFrame({ labeledValues }: Props) {
  const { styles } = useStyles();

  return (
    <FrameButton
      disabled
      style={styles.frameButton}
      showPressedInLightMode
    >
      {labeledValues.map(({ label, value }) => (
        <View key={label} style={styles.valueContainer}>
          <Text style={[styles.text, styles.label]}>
            {label}
          </Text>
          <Text style={[styles.text, styles.title]}>
            {value}
          </Text>
        </View>
      ))}
    </FrameButton>
  );
}
