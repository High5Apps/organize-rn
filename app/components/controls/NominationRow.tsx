import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useTheme from '../../Theme';
import {
  ConfirmationAlert, Nomination, NonPendingNomination,
} from '../../model';
import { HighlightedRowContainer } from '../views';
import DecisionButtonsRow from './DecisionButtonsRow';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.fill,
      flex: 1,
      padding: spacing.s,
    },
    subtitle: {
      color: colors.labelSecondary,
      fontSize: font.sizes.subhead,
      fontFamily: font.weights.regular,
    },
    title: {
      color: colors.label,
      flexShrink: 1,
      fontSize: font.sizes.body,
      fontFamily: font.weights.semiBold,
    },
  });

  return { colors, styles };
};

type Props = {
  currentUserId: string;
  item: Nomination;
  onNominationUpdated: (updatedNomination: NonPendingNomination) => void,
};

export default function NominationRow({
  currentUserId, item: nomination, onNominationUpdated,
}: Props) {
  const { accepted, nominator, nominee } = nomination;
  const { styles } = useStyles();
  const showDecisionButtonRow = currentUserId === nominee.id
    && accepted === null;

  const wrappedOnNominationUpdated = useMemo(
    () => (shouldAccept: boolean) => onNominationUpdated({
      ...nomination, accepted: shouldAccept,
    }),
    [nomination, onNominationUpdated],
  );

  return (
    <HighlightedRowContainer userIds={[nominator.id, nominee.id]}>
      <View style={styles.container}>
        <Text style={styles.title}>{nominee.pseudonym}</Text>
        <Text style={styles.subtitle}>
          {`Nominated by ${nominator.pseudonym}`}
        </Text>
        {showDecisionButtonRow && (
          <DecisionButtonsRow
            onAccept={() => wrappedOnNominationUpdated(true)}
            onDecline={(
              ConfirmationAlert({
                destructiveAction: 'Decline',
                destructiveActionInTitle: 'decline your nomination',
                onConfirm: () => wrappedOnNominationUpdated(false),
              }).show
            )}
          />
        )}
      </View>
    </HighlightedRowContainer>
  );
}
