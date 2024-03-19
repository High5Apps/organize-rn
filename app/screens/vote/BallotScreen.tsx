import React, { useCallback, useMemo } from 'react';
import {
  Alert, StyleSheet, Text, View,
} from 'react-native';
import type { BallotScreenProps } from '../../navigation';
import {
  BallotDetails, CandidateList, LearnMoreButtonRow, ScreenBackground, useBallot,
  useDiscussButton, useLearnMoreOfficeModal, useTimeRemainingFooter,
} from '../../components';
import useTheme from '../../Theme';
import {
  Candidate, useBallotPreviews, useVoteUpdater,
  votingTimeRemainingExpiredFormatter, votingTimeRemainingFormatter,
} from '../../model';

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
    question: {
      fontFamily: font.weights.semiBold,
    },
    text: {
      color: colors.label,
      flexShrink: 1,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
    },
    timeRemainingElection: {
      // Not needed for elections because LearnMoreButtonRow already has
      // built-in margin
      marginTop: 0,
    },
  });

  return { styles };
};

export default function BallotScreen({ navigation, route }: BallotScreenProps) {
  const { params: { ballotId } } = route;

  const {
    ballot, cacheBallot, RequestProgress,
  } = useBallot(ballotId, {
    shouldFetchOnMount: (cachedBallot) => !cachedBallot?.candidates,
  });

  const {
    onNewCandidateSelection,
    selectedCandidateIds,
    waitingForDeselectedCandidateIds,
    waitingForSelectedCandidateIds,
  } = useVoteUpdater({ ballot, cacheBallot });

  const { getCachedBallotPreview } = useBallotPreviews();
  const ballotPreview = getCachedBallotPreview(ballotId);
  if (!ballotPreview) {
    throw new Error('Expected ballotPreview to be defined');
  }

  const {
    LearnMoreOfficeModal, setModalVisible,
  } = useLearnMoreOfficeModal({ officeCategory: ballotPreview.office });

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
      {!!ballot?.candidates?.length && (
        <BallotDetails ballot={ballot} style={styles.ballotDetails} />
      )}
      <RequestProgress />
    </View>
  ), [ballot, ballotPreview, styles]);

  const { TimeRemainingFooter } = useTimeRemainingFooter();

  const ListFooterComponent = useMemo(() => {
    const isElection = ballotPreview.category === 'election';
    return (
      <>
        {isElection && (
          <LearnMoreButtonRow onPress={() => setModalVisible(true)} />
        )}
        <TimeRemainingFooter
          endTime={ballotPreview.votingEndsAt}
          style={isElection && styles.timeRemainingElection}
          timeRemainingOptions={{
            expiredFormatter: votingTimeRemainingExpiredFormatter,
            formatter: votingTimeRemainingFormatter,
          }}
        />
      </>
    );
  }, [ballotPreview, TimeRemainingFooter]);

  const DiscussButton = useDiscussButton(navigation);

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
  }, [onNewCandidateSelection]);

  return (
    <ScreenBackground>
      <LearnMoreOfficeModal />
      <CandidateList
        candidates={ballot?.candidates ?? null}
        DiscussButton={DiscussButton}
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
