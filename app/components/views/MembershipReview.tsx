import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { QRCodeValue } from '../../model';
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

type Props = {
  qrValue: QRCodeValue;
};

export default function MembershipReview({ qrValue }: Props) {
  const { styles } = useStyles();

  return (
    <FrameButton
      disabled
      style={styles.frameButton}
      showPressedInLightMode
    >
      <View style={styles.valueContainer}>
        <Text style={[styles.text, styles.label]}>
          I am
        </Text>
        <Text style={[styles.text, styles.title]}>
          {qrValue.org.potentialMemberDefinition}
        </Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={[styles.text, styles.label]}>
          and I want to join
        </Text>
        <Text style={[styles.text, styles.title]}>
          {qrValue.org.name}
        </Text>
      </View>
    </FrameButton>
  );
}
