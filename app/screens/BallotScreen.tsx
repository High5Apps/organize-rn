import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import {
  Alert, StyleSheet, Text, View,
} from 'react-native';
import type { BallotScreenProps } from '../navigation';
import {
  CandidateList, ScreenBackground, useRequestProgress,
} from '../components';
import useTheme from '../Theme';
import {
  Ballot, Candidate, GENERIC_ERROR_MESSAGE, getTimeRemaining, isCurrentUserData,
  useBallotPreviews, useUserContext, useVoteUpdater,
  votingTimeRemainingFormatter,
} from '../model';
import { fetchBallot } from '../networking';

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
    requestProgress: {
      margin: spacing.m,
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

  const [ballot, setBallot] = useState<Ballot | undefined>();
  const {
    onNewCandidateSelection, selectedCandidateIds,
  } = useVoteUpdater({ ballot });

  const { getCachedBallotPreview } = useBallotPreviews();
  const ballotPreview = getCachedBallotPreview(ballotId);

  const { styles } = useStyles();

  const { RequestProgress, setLoading, setResult } = useRequestProgress();
  const { currentUser } = useUserContext();
  if (!isCurrentUserData(currentUser)) { return null; }
  const { createAuthToken, e2eDecrypt, e2eDecryptMany } = currentUser;

  const updateBallot = useCallback(async () => {
    setResult('none');
    setLoading(true);

    const jwt = await createAuthToken({ scope: '*' });

    let errorMessage: string | undefined;
    let fetchedBallot: Ballot | undefined;
    try {
      ({ ballot: fetchedBallot, errorMessage } = await fetchBallot({
        ballotId, e2eDecrypt, e2eDecryptMany, jwt,
      }));
    } catch (error) {
      errorMessage = GENERIC_ERROR_MESSAGE;
    }

    if (errorMessage !== undefined) {
      setResult('error', {
        message: `${errorMessage}\nTap here to try again`,
        onPress: updateBallot,
      });
      return;
    }

    setBallot(fetchedBallot);
    setLoading(false);
  }, [ballotId, createAuthToken, e2eDecrypt, e2eDecryptMany]);

  useEffect(() => {
    updateBallot().catch(console.error);
  }, []);

  const ListHeaderComponent = useMemo(() => {
    if (!ballotPreview) { return undefined; }
    return (
      <View style={styles.header}>
        <Text style={[styles.text, styles.question]}>
          {ballotPreview.question}
        </Text>
        <Text style={[styles.text, styles.details]}>
          Responses will be anonymous
        </Text>
        <Text style={[styles.text, styles.details]}>
          Change your mind until voting ends
        </Text>
        <RequestProgress style={styles.requestProgress} />
      </View>
    );
  }, [ballotPreview, styles]);

  const ListFooterComponent = useMemo(() => {
    if (!ballotPreview) { return undefined; }
    return (
      <Text style={[styles.text, styles.footer]}>
        {getTimeRemaining(ballotPreview.votingEndsAt, {
          formatter: votingTimeRemainingFormatter,
        })}
      </Text>
    );
  }, [ballotPreview]);

  const onRowPressed = useCallback(async (candidate: Candidate) => {
    try {
      await onNewCandidateSelection(candidate);
    } catch (error) {
      Alert.alert('Failed to update your vote. Please try again.');
    }
  }, [onNewCandidateSelection]);

  if (!ballotPreview) {
    return (
      <ScreenBackground>
        <Text style={[styles.text, styles.error]}>{GENERIC_ERROR_MESSAGE}</Text>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <CandidateList
        candidates={ballot?.candidates ?? null}
        ListFooterComponent={ListFooterComponent}
        ListHeaderComponent={ListHeaderComponent}
        onRowPressed={onRowPressed}
        selectedCandidateIds={selectedCandidateIds}
      />
    </ScreenBackground>
  );
}
