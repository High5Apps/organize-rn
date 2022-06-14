import React from 'react';
import {
  StyleProp, StyleSheet, Text, View, ViewStyle,
} from 'react-native';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    frameButton: {
      alignItems: 'center',
      backgroundColor: colors.fill,
      justifyContent: 'center',
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
  style?: StyleProp<ViewStyle>;
};

export default function ReviewFrame({ labeledValues, style }: Props) {
  const { styles } = useStyles();

  return (
    <View style={[styles.frameButton, style]}>
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
    </View>
  );
}

ReviewFrame.defaultProps = {
  style: {},
};
