import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { BallotScreenProps } from '../navigation';
import { CandidateList, ScreenBackground } from '../components';
import useTheme from '../Theme';
import { GENERIC_ERROR_MESSAGE, useBallots } from '../model';

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
  });

  return { styles };
};

export default function BallotScreen({ route }: BallotScreenProps) {
  const { params: { ballotId } } = route;

  const { getCachedBallot } = useBallots();
  const ballot = getCachedBallot(ballotId);

  const { styles } = useStyles();

  if (!ballot) {
    return (
      <ScreenBackground>
        <Text style={[styles.text, styles.error]}>{GENERIC_ERROR_MESSAGE}</Text>
      </ScreenBackground>
    );
  }

  const ListHeaderComponent = useMemo(() => (
    <View style={styles.header}>
      <Text style={[styles.text, styles.question]}>{ballot.question}</Text>
      <Text style={[styles.text, styles.details]}>
        You can change your vote until voting ends
      </Text>
      <Text style={[styles.text, styles.details]}>
        Responses will be anonymous
      </Text>
    </View>
  ), [ballot, styles]);

  return (
    <ScreenBackground>
      <CandidateList
        ballotId={ballotId}
        ListHeaderComponent={ListHeaderComponent}
      />
    </ScreenBackground>
  );
}
