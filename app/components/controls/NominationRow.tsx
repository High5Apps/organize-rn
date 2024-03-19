import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useTheme from '../../Theme';
import {
  ConfirmationAlert, Nomination, NonPendingNomination,
} from '../../model';
import { HighlightedRowContainer } from '../views';
import DecisionButtonsRow from './DecisionButtonsRow';
import TextButton from './TextButton';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.fill,
      flex: 1,
      padding: spacing.s,
    },
    firstColumn: {
      flex: 1,
    },
    innerContainer: {
      alignItems: 'center',
      flexDirection: 'row',
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
  onDiscussPressed: (postId: string) => void;
  onNominationUpdated: (updatedNomination: NonPendingNomination) => void,
};

export default function NominationRow({
  currentUserId, item: nomination, onDiscussPressed, onNominationUpdated,
}: Props) {
  const {
    accepted, nominator, nominee, postId,
  } = nomination;
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
        <View style={styles.innerContainer}>
          <View style={styles.firstColumn}>
            <Text style={styles.title}>{nominee.pseudonym}</Text>
            <Text style={styles.subtitle}>
              {`Nominated by ${nominator.pseudonym}`}
            </Text>
          </View>
          {postId && (
            <TextButton onPress={() => onDiscussPressed(postId)}>
              Discuss
            </TextButton>
          )}
        </View>
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
