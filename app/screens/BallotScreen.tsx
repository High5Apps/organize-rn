import React from 'react';
import { StyleSheet, Text } from 'react-native';
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
    list: {
      marginVertical: spacing.m,
    },
    question: {
      fontFamily: font.weights.semiBold,
      marginTop: spacing.m,
    },
    text: {
      color: colors.label,
      flexShrink: 1,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
      marginHorizontal: spacing.m,
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

  return (
    <ScreenBackground>
      <Text style={[styles.text, styles.question]}>{ballot.question}</Text>
      <Text style={[styles.text, styles.details]}>
        Responses will be anonymous
      </Text>
      <CandidateList ballotId={ballotId} contentContainerStyle={styles.list} />
    </ScreenBackground>
  );
}
