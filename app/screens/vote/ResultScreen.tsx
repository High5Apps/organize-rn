import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ResultScreenProps } from '../../navigation';
import {
  ResultGraph, ResultList, ScreenBackground, useBallot,
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

  const { ballot, RequestProgress } = useBallot(ballotId);

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
      <RequestProgress />
      <ResultGraph
        maxWinners={ballot?.maxCandidateIdsPerVote}
        results={ballot?.results}
        style={styles.graph}
      />
    </View>
  ), [ballotPreview, styles]);

  return (
    <ScreenBackground>
      <ResultList
        ListEmptyComponent={ListEmptyComponent}
        ListHeaderComponent={ListHeaderComponent}
        maxWinners={ballot?.maxCandidateIdsPerVote}
        results={ballot?.results}
      />
    </ScreenBackground>
  );
}
