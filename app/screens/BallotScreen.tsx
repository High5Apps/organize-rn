import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { BallotScreenProps } from '../navigation';
import { CandidateList, ScreenBackground } from '../components';
import useTheme from '../Theme';
import {
  GENERIC_ERROR_MESSAGE, getTimeRemaining, useBallots,
  votingTimeRemainingFormatter,
} from '../model';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    details: {
      color: colors.labelSecondary,
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
      marginBottom: spacing.xs,
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

  const { getCachedBallot } = useBallots();
  const ballot = getCachedBallot(ballotId);

  const { styles } = useStyles();

  const ListHeaderComponent = useMemo(() => {
    if (!ballot) { return undefined; }
    return (
      <View style={styles.header}>
        <Text style={[styles.text, styles.question]}>{ballot.question}</Text>
        <Text style={[styles.text, styles.details]}>
          Responses will be anonymous
        </Text>
        <Text style={[styles.text, styles.details]}>
          Change your mind until voting ends
        </Text>
      </View>
    );
  }, [ballot, styles]);

  const ListFooterComponent = useMemo(() => {
    if (!ballot) { return undefined; }
    return (
      <Text style={[styles.text, styles.footer]}>
        {getTimeRemaining(ballot.votingEndsAt, {
          formatter: votingTimeRemainingFormatter,
        })}
      </Text>
    );
  }, [ballot]);

  if (!ballot) {
    return (
      <ScreenBackground>
        <Text style={[styles.text, styles.error]}>{GENERIC_ERROR_MESSAGE}</Text>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <CandidateList
        ballotId={ballotId}
        ListFooterComponent={ListFooterComponent}
        ListHeaderComponent={ListHeaderComponent}
      />
    </ScreenBackground>
  );
}
