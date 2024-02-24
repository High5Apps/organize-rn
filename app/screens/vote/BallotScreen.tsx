import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert, StyleSheet, Text, View,
} from 'react-native';
import type { BallotScreenProps } from '../../navigation';
import { CandidateList, ScreenBackground, useBallot } from '../../components';
import useTheme from '../../Theme';
import {
  Candidate, getTimeRemaining, useBallotPreviews, useVoteUpdater,
  votingTimeRemainingExpiredFormatter, votingTimeRemainingFormatter,
} from '../../model';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    details: {
      color: colors.labelSecondary,
    },
    directions: {
      marginTop: spacing.xs,
    },
    emptyResultsText: {
      paddingHorizontal: spacing.l,
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
  if (!ballotPreview) {
    throw new Error('Expected ballotPreview to be defined');
  }

  const { styles } = useStyles();

  const ListEmptyComponent = useMemo(() => (
    <Text style={[styles.text, styles.emptyResultsText]}>
      No one accepted a nomination
    </Text>
  ), []);

  const ListHeaderComponent = useMemo(() => (
    <View style={styles.header}>
      <Text style={[styles.text, styles.question]}>
        {ballotPreview.question}
      </Text>
      { ballot?.candidates?.length ? (
        <View style={styles.directions}>
          {ballot.maxCandidateIdsPerVote > 1 && (
            <Text style={[styles.text, styles.details]}>
              {`Select up to ${ballot.maxCandidateIdsPerVote}`}
            </Text>
          )}
          <Text style={[styles.text, styles.details]}>
            Responses will be anonymous
          </Text>
          <Text style={[styles.text, styles.details]}>
            Change your mind until voting ends
          </Text>
        </View>
      ) : null}
      <RequestProgress />
    </View>
  ), [ballot, ballotPreview, styles]);

  const ListFooterComponent = useMemo(() => (
    <Text style={[styles.text, styles.footer]} onPress={updateTime}>
      {getTimeRemaining(ballotPreview.votingEndsAt, {
        formatter: votingTimeRemainingFormatter,
        expiredFormatter: votingTimeRemainingExpiredFormatter,
        now,
      })}
    </Text>
  ), [ballotPreview, now]);

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
      <CandidateList
        candidates={ballot?.candidates ?? null}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
        ListHeaderComponent={ListHeaderComponent}
        maxSelections={ballot?.maxCandidateIdsPerVote}
        onRowPressed={onRowPressed}
        selectedCandidateIds={selectedCandidateIds}
        waitingForDeselectedCandidateIds={waitingForDeselectedCandidateIds}
        waitingForSelectedCandidateIds={waitingForSelectedCandidateIds}
      />
    </ScreenBackground>
  );
}
