import React, { useCallback, useMemo } from 'react';
import {
  Alert, StyleSheet, Text, View,
} from 'react-native';
import type { ResultScreenProps } from '../../navigation';
import {
  BallotDetails, LearnMoreButtonRow, ResultGraph, ResultList, ScreenBackground,
  useBallot, useLearnMoreOfficeModal, useTimeRemainingFooter,
} from '../../components';
import {
  GENERIC_ERROR_MESSAGE, Result, useBallotPreviews, useCurrentUser,
} from '../../model';
import useTheme from '../../Theme';
import { createTerm } from '../../networking';

const ERROR_ALERT_TITLE = 'Failed to accept or decline office. Please try again.';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    ballotDetails: {
      marginTop: spacing.xs,
    },
    emptyResultsText: {
      paddingHorizontal: spacing.l,
    },
    header: {
      margin: spacing.m,
    },
    graph: {
      marginTop: spacing.m,
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
    timeRemainingFooter: {
      // Override default style because LearnMoreButtonRow already has built-in
      // margin
      marginTop: 0,
    },
  });

  return { styles };
};

export default function ResultScreen({ route }: ResultScreenProps) {
  const { params: { ballotId } } = route;

  const {
    ballot, cacheBallot, RequestProgress,
  } = useBallot(ballotId, {
    shouldFetchOnMount: (cachedBallot) => {
      if (!cachedBallot?.results) {
        return true;
      }

      // Allow updating office acceptance
      if (cachedBallot.category === 'election') {
        const beforeTermStart = (
          new Date().getTime() < cachedBallot.termStartsAt.getTime()
        );
        const anyAcceptancesPending = cachedBallot.results.some((result) => {
          const isWinner = result.rank < cachedBallot.maxCandidateIdsPerVote;
          const isPending = result.acceptedOffice === undefined;
          return isWinner && isPending;
        });
        if (beforeTermStart && anyAcceptancesPending) {
          return true;
        }
      }

      return false;
    },
  });

  const { getCachedBallotPreview } = useBallotPreviews();
  const ballotPreview = getCachedBallotPreview(ballotId);
  if (!ballotPreview) {
    throw new Error('Expected ballotPreview to be defined');
  }

  const { currentUser } = useCurrentUser();
  if (!currentUser) { throw new Error('Expected current user'); }

  const { styles } = useStyles();

  const {
    LearnMoreOfficeModal, setModalVisible,
  } = useLearnMoreOfficeModal({ officeCategory: ballotPreview.office });

  const onResultUpdated = useCallback(async (updatedResult: Result) => {
    if (!ballot || updatedResult.acceptedOffice === undefined) { return; }

    // Optimistically cache the updated ballot. Note there's no need to update
    // currentUser.offices because the term cannot have started yet.
    cacheBallot({
      ...ballot,
      results: ballot.results?.map((result) => (
        (result.candidate.id !== updatedResult.candidate.id)
          ? result : updatedResult)),
    });

    const jwt = await currentUser.createAuthToken({ scope: '*' });

    let errorMessage: string | undefined;
    try {
      ({ errorMessage } = await createTerm({
        accepted: updatedResult.acceptedOffice, ballotId: ballot.id, jwt,
      }));
    } catch (error) {
      errorMessage = GENERIC_ERROR_MESSAGE;
    }

    if (errorMessage) {
      // On error, revert ballot back to what it was before the optimistic
      // update
      cacheBallot(ballot);

      Alert.alert(ERROR_ALERT_TITLE, errorMessage);
    }
  }, [ballot, cacheBallot, currentUser]);

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
      {(ballot?.results ?? []).length > 0 && (
        <BallotDetails ballot={ballot} style={styles.ballotDetails} />
      )}
      <RequestProgress />
      <ResultGraph
        maxWinners={ballot?.maxCandidateIdsPerVote}
        results={ballot?.results}
        style={styles.graph}
      />
    </View>
  ), [ballotPreview, styles]);

  const { TimeRemainingFooter } = useTimeRemainingFooter();

  const TimerRemainingCountdown = useMemo(() => {
    if (ballot?.category !== 'election' || ballot?.results?.length === 0) {
      return undefined;
    }

    const { termStartsAt, termEndsAt } = ballot;
    const termStarted = termStartsAt.getTime() <= new Date().getTime();

    const allWinningTermsDeclined = ballot.results?.every((result) => {
      const isWinner = result.rank < ballot.maxCandidateIdsPerVote;
      return !isWinner || result.acceptedOffice === false;
    });
    if (!termStarted && allWinningTermsDeclined) { return undefined; }

    const anyTermAccepted = ballot.results?.some((r) => r.acceptedOffice);
    if (termStarted && !anyTermAccepted) { return undefined; }

    const endTime = termStarted ? termEndsAt : termStartsAt;
    const expiredFormatter = () => (
      `Term ${termStarted ? 'ended' : 'started'}`
    );
    const formatter = (timeRemaining: string) => (
      `${timeRemaining} until term ${termStarted ? 'ends' : 'starts'}`
    );
    return (
      <TimeRemainingFooter
        endTime={endTime}
        style={styles.timeRemainingFooter}
        timeRemainingOptions={{ expiredFormatter, formatter }}
      />
    );
  }, [ballot]);

  const ListFooterComponent = useMemo(() => (
    <>
      <LearnMoreButtonRow onPress={() => setModalVisible(true)} />
      {TimerRemainingCountdown}
    </>
  ), [TimerRemainingCountdown]);

  return (
    <ScreenBackground>
      <LearnMoreOfficeModal />
      <ResultList
        currentUserId={currentUser.id}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
        ListHeaderComponent={ListHeaderComponent}
        maxWinners={ballot?.maxCandidateIdsPerVote}
        onResultUpdated={onResultUpdated}
        results={ballot?.results}
        termStartsAt={
          ballot?.category === 'election' ? ballot.termStartsAt : undefined
        }
      />
    </ScreenBackground>
  );
}
