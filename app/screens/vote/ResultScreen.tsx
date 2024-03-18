import React, { useCallback, useMemo } from 'react';
import {
  Alert, StyleSheet, Text, View,
} from 'react-native';
import type { ResultScreenProps } from '../../navigation';
import {
  LearnMoreButtonRow, ResultGraph, ResultList, ScreenBackground, useBallot,
  useLearnMoreOfficeModal,
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
      if (cachedBallot.category === 'election'
          && new Date().getTime() < cachedBallot.termStartsAt.getTime()) {
        return true;
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
      <RequestProgress />
      <ResultGraph
        maxWinners={ballot?.maxCandidateIdsPerVote}
        results={ballot?.results}
        style={styles.graph}
      />
    </View>
  ), [ballotPreview, styles]);

  const ListFooterComponent = useMemo(() => (
    (ballot?.category === 'election')
      ? <LearnMoreButtonRow onPress={() => setModalVisible(true)} />
      : undefined
  ), [ballot]);

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
