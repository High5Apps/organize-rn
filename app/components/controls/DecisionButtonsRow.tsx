import React from 'react';
import { StyleSheet, View } from 'react-native';
import useTheme from '../../Theme';
import { PrimaryButton, SecondaryButton } from './buttons';
import { useTranslation } from '../../i18n';

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
  acceptLabel?: string;
  onAccept: () => void;
  onDecline: () => void;
};

export default function DecisionButtonsRow({
  acceptLabel: maybeAcceptLabel, onAccept, onDecline,
}: Props) {
  const { t } = useTranslation();
  const acceptLabel = maybeAcceptLabel ?? t('action.accept');
  const { styles } = useStyles();
  return (
    <View style={styles.container}>
      <SecondaryButton
        label={t('action.decline')}
        onPress={onDecline}
        style={[styles.button, styles.buttonDecline]}
      />
      <PrimaryButton
        label={acceptLabel}
        onPress={onAccept}
        style={styles.button}
      />
    </View>
  );
}
