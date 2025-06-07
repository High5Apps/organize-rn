import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useTheme from '../../../../Theme';
import { Nomination, NonPendingNomination } from '../../../../model';
import { HighlightedCurrentUserRowContainer } from '../../../views';
import DecisionButtonsRow from '../../DecisionButtonsRow';
import type { AnnounceButtonType, DiscussButtonType } from '../../buttons';
import { ConfirmationAlert } from '../../modals';
import { useTranslation } from '../../../../i18n';

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
      columnGap: spacing.s,
      flexDirection: 'row',
    },
    subtitle: {
      color: colors.labelSecondary,
      fontSize: font.sizes.body,
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
  AnnounceButton: AnnounceButtonType;
  currentUserId: string;
  DiscussButton: DiscussButtonType;
  item: Nomination;
  onNominationUpdated: (updatedNomination: NonPendingNomination) => void,
};

export default function NominationRow({
  AnnounceButton, currentUserId, DiscussButton, item: nomination,
  onNominationUpdated,
}: Props) {
  const {
    accepted, candidate, nominator, nominee,
  } = nomination;
  const { styles } = useStyles();
  const { t } = useTranslation();
  const showDecisionButtonRow = currentUserId === nominee.id
    && accepted === null;

  const wrappedOnNominationUpdated = useMemo(
    () => (shouldAccept: boolean) => onNominationUpdated({
      ...nomination, accepted: shouldAccept,
    }),
    [nomination, onNominationUpdated],
  );

  return (
    <HighlightedCurrentUserRowContainer userIds={[nominator.id, nominee.id]}>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.firstColumn}>
            <Text style={styles.title}>{nominee.pseudonym}</Text>
            <Text style={styles.subtitle}>
              {t('hint.nomination.byline', { nominator: nominator.pseudonym })}
            </Text>
          </View>
          <DiscussButton postId={candidate?.postId} />
          <AnnounceButton
            currentUserId={currentUserId}
            nomination={nomination}
          />
        </View>
        {showDecisionButtonRow && (
          <DecisionButtonsRow
            onAccept={() => wrappedOnNominationUpdated(true)}
            onDecline={(
              ConfirmationAlert({
                destructiveAction: t('action.decline'),
                message: t('hint.confirmation.declineNomination'),
                onConfirm: () => wrappedOnNominationUpdated(false),
              }).show
            )}
          />
        )}
      </View>
    </HighlightedCurrentUserRowContainer>
  );
}
