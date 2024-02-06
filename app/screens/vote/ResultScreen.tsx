import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ResultScreenProps } from '../../navigation';
import {
  ResultGraph, ResultList, ScreenBackground, useBallot,
} from '../../components';
import { GENERIC_ERROR_MESSAGE, useBallotPreviews } from '../../model';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    error: {
      color: colors.error,
      marginTop: spacing.m,
      textAlign: 'center',
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

  const { ballot, rankedResults, RequestProgress } = useBallot(ballotId);

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
        <RequestProgress />
        <ResultGraph
          maxWinners={ballot?.maxCandidateIdsPerVote}
          rankedResults={rankedResults}
          style={styles.graph}
        />
      </View>
    );
  }, [ballotPreview, styles]);

  return (
    <ScreenBackground>
      {ballotPreview ? (
        <ResultList
          ListHeaderComponent={ListHeaderComponent}
          maxWinners={ballot?.maxCandidateIdsPerVote}
          rankedResults={rankedResults}
        />
      ) : (
        <Text style={[styles.text, styles.error]}>{GENERIC_ERROR_MESSAGE}</Text>
      )}
    </ScreenBackground>
  );
}
