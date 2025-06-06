import React, { useCallback, useMemo } from 'react';
import {
  Alert, StyleSheet, Text, View,
} from 'react-native';
import type { ResultScreenProps } from '../../navigation';
import {
  BallotDetails, LearnMoreButtonRow, ResultGraph, ResultList, ScreenBackground,
  useBallotProgress, useDiscussButton, useLearnMoreOfficeModal,
  useTimeRemainingFooter,
} from '../../components';
import {
  getErrorMessage, Result, useBallotPreviews, useCurrentUser,
} from '../../model';
import useTheme from '../../Theme';
import { useTranslation } from '../../i18n';

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

export default function ResultScreen({ navigation, route }: ResultScreenProps) {
  const { params: { ballotId } } = route;

  const {
    ballot, RequestProgress, updateResultOptimistically,
  } = useBallotProgress({
    ballotId,
    shouldFetchOnMount: (cachedBallot) => {
      if (!cachedBallot?.results) { return true; }

      const { category } = cachedBallot;
      if (category === 'yes_no' || category === 'multiple_choice') {
        return false;
      }

      if (category === 'election') {
        const { refreshedAt, termStartsAt } = cachedBallot;
        if (termStartsAt.getTime() <= (refreshedAt?.getTime() ?? 0)) {
          return false;
        }

        const anyAcceptancesPending = cachedBallot.results.some((result) => (
          result.isWinner && result.acceptedOffice === undefined
        ));
        if (!anyAcceptancesPending) { return false; }
      }

      return true;
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
  const { t } = useTranslation();

  const {
    LearnMoreOfficeModal, setModalVisible,
  } = useLearnMoreOfficeModal({ officeCategory: ballotPreview.office });

  const onResultUpdated = useCallback(async (updatedResult: Result) => {
    try {
      await updateResultOptimistically({ updatedResult });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      Alert.alert(t('result.error.updateTerm'), errorMessage);
    }
  }, [updateResultOptimistically, t]);

  const ListEmptyComponent = useMemo(() => (
    <Text style={[styles.text, styles.emptyResultsText]}>
      {t('hint.nomination.noneAccepted')}
    </Text>
  ), [t]);

  const ListHeaderComponent = useMemo(() => (
    <View style={styles.header}>
      <Text style={[styles.text, styles.question]}>
        {ballotPreview.question}
      </Text>
      {(ballot?.results ?? []).length > 0 && (
        <BallotDetails ballot={ballot} style={styles.ballotDetails} />
      )}
      <RequestProgress />
      <ResultGraph results={ballot?.results} style={styles.graph} />
    </View>
  ), [ballotPreview, styles]);

  const { TimeRemainingFooter } = useTimeRemainingFooter();

  const TimeRemainingCountdown = useMemo(() => {
    if (ballot?.category !== 'election') { return undefined; }

    const { termStartsAt, termEndsAt } = ballot;
    const termStarted = termStartsAt.getTime() <= new Date().getTime();

    const allWinningTermsDeclined = ballot.results?.every((result) => (
      !result.isWinner || result.acceptedOffice === false
    ));
    if (!termStarted && allWinningTermsDeclined) { return undefined; }

    const anyTermAccepted = ballot.results?.some((r) => r.acceptedOffice);
    if (termStarted && !anyTermAccepted) { return undefined; }

    const endTime = termStarted ? termEndsAt : termStartsAt;
    const expiredFormatter = () => (
      t(termStarted ? 'time.hint.past.termEnd' : 'time.hint.past.termStart')
    );
    const formatter = (timeRemaining: string) => t(
      termStarted
        ? 'time.hint.remaining.termEnd'
        : 'time.hint.remaining.termStart',
      { timeRemaining },
    );
    return (
      <TimeRemainingFooter
        endTime={endTime}
        style={styles.timeRemainingFooter}
        timeRemainingOptions={{ expiredFormatter, formatter }}
      />
    );
  }, [ballot]);

  const ListFooterComponent = useMemo(() => {
    if (!ballot?.results?.length) { return undefined; }
    return (
      <>
        {ballot?.category === 'election' && (
          <LearnMoreButtonRow onPress={() => setModalVisible(true)} />
        )}
        {TimeRemainingCountdown}
      </>
    );
  }, [ballot?.results?.length, TimeRemainingCountdown]);

  const DiscussButton = useDiscussButton(navigation);

  return (
    <ScreenBackground>
      <LearnMoreOfficeModal />
      <ResultList
        currentUserId={currentUser.id}
        DiscussButton={DiscussButton}
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
