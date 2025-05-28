import React, { useMemo } from 'react';
import {
  StyleSheet, Text, View, ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../../../Theme';
import { Result, isDefined } from '../../../../model';
import DecisionButtonsRow from '../../DecisionButtonsRow';
import { HighlightedCurrentUserRowContainer } from '../../../views';
import type { DiscussButtonType } from '../../buttons';
import { ConfirmationAlert } from '../../modals';
import { useTranslation } from '../../../../i18n';

const useStyles = () => {
  const {
    colors, font, opacity, sizes, spacing,
  } = useTheme();

  const firstRowColumnGap = spacing.m;
  const iconFontSize = sizes.mediumIcon;
  const subtitleMarginStart = firstRowColumnGap + iconFontSize;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.m,
    },
    firstRow: {
      alignItems: 'center',
      columnGap: firstRowColumnGap,
      flexDirection: 'row',
    },
    icon: {
      color: colors.primary,
      fontSize: iconFontSize,
    },
    iconDim: {
      opacity: opacity.disabled,
    },
    rank: {
      color: colors.primary,
      fontSize: font.sizes.body,
      fontFamily: font.weights.semiBold,
    },
    rankContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      ...StyleSheet.absoluteFillObject,
    },
    subtitle: {
      color: colors.labelSecondary,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
      marginStart: subtitleMarginStart,
    },
    text: {
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
      flex: 1,
    },
  });

  return { styles };
};

type IconProps = {
  maxVoteCount: number;
  maxWinners: number;
  result: Result;
};

function useIcon({ maxVoteCount, maxWinners, result }: IconProps) {
  const { isWinner, rank, voteCount } = result;
  const multiSelection = maxWinners > 1;
  const multiSelectionWinnerRank = (multiSelection && isWinner)
    ? rank : undefined;
  const receivedMaxVotes = voteCount === maxVoteCount;
  const singleSelectionLoser = !multiSelection && !isWinner;
  const singleSelectionTied = singleSelectionLoser && receivedMaxVotes;
  const singleSelectionWinner = !multiSelection && isWinner;

  const { styles } = useStyles();

  let iconName: string;
  let iconStyle: ViewStyle = {};

  if (singleSelectionWinner) {
    iconName = 'check-circle';
  } else if (singleSelectionTied) {
    iconName = 'pause-circle-filled';
    iconStyle = { transform: [{ rotate: '90deg' }] };
  } else if (singleSelectionLoser) {
    iconName = 'radio-button-unchecked';
  } else {
    iconName = 'check-box-outline-blank';
  }

  if (!isWinner) {
    iconStyle = { ...iconStyle, ...styles.iconDim };
  }

  return useMemo(() => (
    <View>
      <Icon name={iconName} style={[styles.icon, iconStyle]} />
      {(multiSelectionWinnerRank !== undefined) && (
        <View style={styles.rankContainer}>
          <Text allowFontScaling={false} style={styles.rank}>
            {1 + multiSelectionWinnerRank}
          </Text>
        </View>
      )}
    </View>
  ), [iconName, iconStyle, multiSelectionWinnerRank, styles]);
}

function getOfficeAcceptance(termStartsAt: Date, acceptedOffice?: boolean) {
  if (acceptedOffice) {
    return 'Accepted office';
  }

  if (acceptedOffice === false) {
    return 'Declined office';
  }

  if (new Date().getTime() < termStartsAt?.getTime()) {
    return "Hasn't accepted office yet";
  }

  return 'Missed deadline to accept office';
}

type Props = IconProps & {
  currentUserId: string;
  DiscussButton: DiscussButtonType;
  onResultUpdated: (result: Result) => void;
  termStartsAt?: Date;
};

export default function ResultRow({
  currentUserId, DiscussButton, maxVoteCount, maxWinners, onResultUpdated,
  result, termStartsAt,
}: Props) {
  const { candidate: { postId, title, userId } } = result;
  const { styles } = useStyles();
  const { t } = useTranslation();

  const IconComponent = useIcon({ maxVoteCount, maxWinners, result });

  const SecondRow = useMemo(() => {
    const { acceptedOffice, candidate, isWinner } = result;

    const shouldShowDecisionButtonRow = isWinner
      && candidate.userId === currentUserId
      && acceptedOffice === undefined;
    const shouldShowAcceptance = isWinner && !!termStartsAt;

    const onAccepted = (accepted: boolean) => onResultUpdated({
      ...result,
      acceptedOffice: accepted,
    });

    if (shouldShowDecisionButtonRow) {
      return (
        <DecisionButtonsRow
          acceptLabel={t('action.acceptOffice')}
          onAccept={() => onAccepted(true)}
          onDecline={(
            ConfirmationAlert({
              destructiveAction: t('action.decline'),
              destructiveActionInTitle: 'decline office',
              onConfirm: () => onAccepted(false),
            }).show
          )}
        />
      );
    }

    if (shouldShowAcceptance) {
      return (
        <Text style={styles.subtitle}>
          {getOfficeAcceptance(termStartsAt, acceptedOffice)}
        </Text>
      );
    }

    return null;
  }, [currentUserId, result, onResultUpdated, termStartsAt]);

  return (
    <HighlightedCurrentUserRowContainer userIds={[userId].filter(isDefined)}>
      <View style={styles.container}>
        <View style={styles.firstRow}>
          {IconComponent}
          <Text style={styles.text}>{title}</Text>
          <DiscussButton postId={postId} />
        </View>
        {SecondRow}
      </View>
    </HighlightedCurrentUserRowContainer>
  );
}
