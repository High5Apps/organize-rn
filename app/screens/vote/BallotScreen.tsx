import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { BallotScreenProps } from '../../navigation';
import {
  BallotDetails, CandidateList, LearnMoreButtonRow, ScreenBackground,
  useBallotProgress, useDiscussButton, useFlagHeaderButton,
  useLearnMoreOfficeModal, useTimeRemainingFooter,
} from '../../components';
import useTheme from '../../Theme';
import {
  useBallotPreviews, votingTimeRemainingExpiredFormatter,
  votingTimeRemainingFormatter,
} from '../../model';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    ballotDetails: {
      marginTop: spacing.xs,
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
  } = useBallotProgress({
    ballotId,
    shouldFetchOnMount: (cachedBallot) => {
      if (!cachedBallot?.candidates) { return true; }

      const { category } = cachedBallot;
      if (category === 'yes_no' || category === 'multiple_choice') {
        return false;
      }

      if (category === 'election') {
        const { nominationsEndAt, refreshedAt } = cachedBallot;
        if (nominationsEndAt.getTime() <= (refreshedAt?.getTime() ?? 0)) {
          return false;
        }
      }

      return true;
    },
  });

  const { getCachedBallotPreview } = useBallotPreviews();
  const ballotPreview = getCachedBallotPreview(ballotId);
  const ballotOrBallotPreview = ballot ?? ballotPreview;

  const {
    LearnMoreOfficeModal, setModalVisible,
  } = useLearnMoreOfficeModal({
    officeCategory: ballotOrBallotPreview?.office ?? null,
  });

  useFlagHeaderButton({
    ballotId,
    hidden: ballotOrBallotPreview?.category === 'election',
    navigation,
  });

  const { styles } = useStyles();

  const ListHeaderComponent = useMemo(() => (
    <View style={ballotOrBallotPreview && styles.header}>
      {ballotOrBallotPreview && (
        <Text style={[styles.text, styles.question]}>
          {ballotOrBallotPreview.question}
        </Text>
      )}
      {!!ballot?.candidates?.length && (
        <BallotDetails ballot={ballot} style={styles.ballotDetails} />
      )}
      <RequestProgress />
    </View>
  ), [ballot, ballotOrBallotPreview, styles]);

  const { TimeRemainingFooter } = useTimeRemainingFooter();

  const ListFooterComponent = useMemo(() => {
    const isElection = ballotOrBallotPreview?.category === 'election';
    return (
      <>
        {isElection && (
          <LearnMoreButtonRow onPress={() => setModalVisible(true)} />
        )}
        <TimeRemainingFooter
          endTime={ballotOrBallotPreview?.votingEndsAt}
          style={isElection && styles.timeRemainingElection}
          timeRemainingOptions={{
            expiredFormatter: votingTimeRemainingExpiredFormatter,
            formatter: votingTimeRemainingFormatter,
          }}
        />
      </>
    );
  }, [ballot, ballotOrBallotPreview, TimeRemainingFooter]);

  const DiscussButton = useDiscussButton(navigation);

  return (
    <ScreenBackground>
      <LearnMoreOfficeModal />
      <CandidateList
        ballot={ballot}
        cacheBallot={cacheBallot}
        DiscussButton={DiscussButton}
        ListFooterComponent={ListFooterComponent}
        ListHeaderComponent={ListHeaderComponent}
      />
    </ScreenBackground>
  );
}
