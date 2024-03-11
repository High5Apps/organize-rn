import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ResultScreenProps } from '../../navigation';
import {
  LearnMoreButtonRow, ResultGraph, ResultList, ScreenBackground, useBallot,
  useLearnMoreOfficeModal,
} from '../../components';
import { useBallotPreviews } from '../../model';
import useTheme from '../../Theme';

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
    ballot, RequestProgress,
  } = useBallot(ballotId, { fetchOnMount: true });

  const { getCachedBallotPreview } = useBallotPreviews();
  const ballotPreview = getCachedBallotPreview(ballotId);
  if (!ballotPreview) {
    throw new Error('Expected ballotPreview to be defined');
  }

  const { styles } = useStyles();

  const {
    LearnMoreOfficeModal, setModalVisible,
  } = useLearnMoreOfficeModal({ officeCategory: ballotPreview.office });

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
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
        ListHeaderComponent={ListHeaderComponent}
        maxWinners={ballot?.maxCandidateIdsPerVote}
        results={ballot?.results}
      />
    </ScreenBackground>
  );
}
