import React, { useCallback, useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import useTheme from '../../Theme';
import useRequestProgress from './RequestProgress';
import { Ballot, GENERIC_ERROR_MESSAGE, useCurrentUser } from '../../model';
import { fetchBallot } from '../../networking';
import { useBallotContext } from '../../context';

const useStyles = () => {
  const { spacing } = useTheme();

  const styles = StyleSheet.create({
    requestProgress: {
      margin: spacing.m,
    },
  });

  return { styles };
};

type Options = {
  shouldFetchOnMount?: (cachedBallot?: Ballot) => boolean;
};

export default function useBallot(ballotId: string, options: Options = {}) {
  const { cacheBallot, getCachedBallot } = useBallotContext();

  const ballot = useMemo(
    () => getCachedBallot(ballotId),
    [ballotId, getCachedBallot],
  );

  const { currentUser } = useCurrentUser();

  const {
    RequestProgress: UnstyledRequestProgress, setLoading, setResult,
  } = useRequestProgress();

  const updateBallot = useCallback(async () => {
    setResult('none');
    setLoading(true);

    if (!currentUser) { return; }
    const { createAuthToken, e2eDecrypt, e2eDecryptMany } = currentUser;

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
    } else if (fetchedBallot) {
      cacheBallot(fetchedBallot);
      setLoading(false);
    }
  }, [ballotId, currentUser]);

  useEffect(() => {
    if (options?.shouldFetchOnMount?.(ballot)) {
      updateBallot().catch(console.error);
    }
  }, [ballot, options.shouldFetchOnMount, updateBallot]);

  const { styles } = useStyles();

  const RequestProgress = useCallback(
    () => <UnstyledRequestProgress style={styles.requestProgress} />,
    [UnstyledRequestProgress],
  );

  return {
    ballot, cacheBallot, getCachedBallot, RequestProgress, updateBallot,
  };
}
