import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { BallotScreenProps } from '../../navigation';
import {
  BallotDetails, CandidateList, LearnMoreButtonRow, ScreenBackground, useBallot,
  useDiscussButton, useHeaderButton, useLearnMoreOfficeModal,
  useTimeRemainingFooter,
} from '../../components';
import useTheme from '../../Theme';
import {
  useBallotPreviews, useFlaggedItem, votingTimeRemainingExpiredFormatter,
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
  } = useBallot(ballotId, {
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
  if (!ballotPreview) {
    throw new Error('Expected ballotPreview to be defined');
  }

  const {
    LearnMoreOfficeModal, setModalVisible,
  } = useLearnMoreOfficeModal({ officeCategory: ballotPreview.office });

  const { confirmThenCreateFlaggedItem } = useFlaggedItem({ ballotId });
  useHeaderButton({
    hidden: !['multiple_choice', 'yes_no'].includes(ballotPreview.category),
    iconName: 'flag',
    navigation,
    onPress: confirmThenCreateFlaggedItem,
  });

  const { styles } = useStyles();

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
