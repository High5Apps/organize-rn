import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert, StyleSheet, Text, View,
} from 'react-native';
import type { BallotScreenProps } from '../../navigation';
import { CandidateList, ScreenBackground, useBallot } from '../../components';
import useTheme from '../../Theme';
import {
  Candidate, GENERIC_ERROR_MESSAGE, getTimeRemaining, useBallotPreviews,
  useVoteUpdater, votingTimeRemainingExpiredFormatter,
  votingTimeRemainingFormatter,
} from '../../model';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    details: {
      color: colors.labelSecondary,
    },
    error: {
      color: colors.error,
      marginTop: spacing.m,
      textAlign: 'center',
    },
    footer: {
      color: colors.labelSecondary,
      margin: spacing.m,
      textAlign: 'center',
    },
    header: {
      margin: spacing.m,
    },
    question: {
      fontFamily: font.weights.semiBold,
      marginBottom: spacing.xs,
    },
    text: {
      color: colors.label,
      flexShrink: 1,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
    },
  });

  return { styles };
};

export default function BallotScreen({ route }: BallotScreenProps) {
  const { params: { ballotId } } = route;

  const [now, setNow] = useState<Date>(new Date());
  const updateTime = () => setNow(new Date());

  const { ballot, RequestProgress } = useBallot(ballotId);

  const {
    onNewCandidateSelection,
    selectedCandidateIds,
    waitingForDeselectedCandidateIds,
    waitingForSelectedCandidateIds,
  } = useVoteUpdater({ ballot });

  const { getCachedBallotPreview } = useBallotPreviews();
  const ballotPreview = getCachedBallotPreview(ballotId);

  const { styles } = useStyles();

  const ListHeaderComponent = useMemo(() => {
    if (!ballotPreview) { return undefined; }
    return (
      <View style={styles.header}>
        <Text style={[styles.text, styles.question]}>
          {ballotPreview.question}
        </Text>
        <Text style={[styles.text, styles.details]}>
          Responses will be anonymous
        </Text>
        <Text style={[styles.text, styles.details]}>
          Change your mind until voting ends
        </Text>
        <RequestProgress />
      </View>
    );
  }, [ballotPreview, styles]);

  const ListFooterComponent = useMemo(() => {
    if (!ballotPreview) { return undefined; }
    return (
      <Text style={[styles.text, styles.footer]} onPress={updateTime}>
        {getTimeRemaining(ballotPreview.votingEndsAt, {
          formatter: votingTimeRemainingFormatter,
          expiredFormatter: votingTimeRemainingExpiredFormatter,
          now,
        })}
      </Text>
    );
  }, [ballotPreview, now]);

  const onRowPressed = useCallback(async (candidate: Candidate) => {
    try {
      await onNewCandidateSelection(candidate);
    } catch (error) {
      let errorMessage = 'Failed to update your vote. Please try again.';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      Alert.alert(errorMessage);
    }
    updateTime();
  }, [onNewCandidateSelection]);

  return (
    <ScreenBackground>
      {ballotPreview ? (
        <CandidateList
          candidates={ballot?.candidates ?? null}
          ListFooterComponent={ListFooterComponent}
          ListHeaderComponent={ListHeaderComponent}
          onRowPressed={onRowPressed}
          selectedCandidateIds={selectedCandidateIds}
          waitingForDeselectedCandidateIds={waitingForDeselectedCandidateIds}
          waitingForSelectedCandidateIds={waitingForSelectedCandidateIds}
        />
      ) : (
        <Text style={[styles.text, styles.error]}>{GENERIC_ERROR_MESSAGE}</Text>
      )}
    </ScreenBackground>
  );
}
