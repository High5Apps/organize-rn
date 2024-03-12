import React from 'react';
import { StyleSheet, View } from 'react-native';
import useTheme from '../../Theme';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

const useStyles = () => {
  const { colors, sizes, spacing } = useTheme();

  const styles = StyleSheet.create({
    button: {
      flex: 1,
      paddingVertical: spacing.xs,
    },
    buttonDecline: {
      borderWidth: sizes.border,
      borderColor: colors.primary,
      borderRadius: 10000, // An arbitrarily large value to ensure fully rounded
      height: -1, // Needed to cancel SecondaryButton's default height
    },
    container: {
      backgroundColor: colors.fill,
      columnGap: spacing.m,
      flexDirection: 'row',
      marginVertical: spacing.s,
    },
  });

  return { styles };
};

type Props = {
  onAccept: () => void;
  onDecline: () => void;
};

export default function DecisionButtonsRow({ onAccept, onDecline }: Props) {
  const { styles } = useStyles();
  return (
    <View style={styles.container}>
      <SecondaryButton
        label="Decline"
        onPress={onDecline}
        style={[styles.button, styles.buttonDecline]}
      />
      <PrimaryButton label="Accept" onPress={onAccept} style={styles.button} />
    </View>
  );
}
