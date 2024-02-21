import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import useTheme from '../../Theme';
import useRequestProgress from './RequestProgress';
import {
  Ballot, GENERIC_ERROR_MESSAGE, isCurrentUserData, useUserContext,
} from '../../model';
import { fetchBallot } from '../../networking';

const useStyles = () => {
  const { spacing } = useTheme();

  const styles = StyleSheet.create({
    requestProgress: {
      margin: spacing.m,
    },
  });

  return { styles };
};

export default function useBallot(ballotId: string) {
  const [ballot, setBallot] = useState<Ballot | undefined>();

  const { currentUser } = useUserContext();

  const {
    RequestProgress: UnstyledRequestProgress, setLoading, setResult,
  } = useRequestProgress();

  const updateBallot = useCallback(async () => {
    setResult('none');
    setLoading(true);

    if (!isCurrentUserData(currentUser)) { return; }
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
      return;
    }

    setBallot(fetchedBallot);
    setLoading(false);
  }, [ballotId, currentUser]);

  useEffect(() => {
    updateBallot().catch(console.error);
  }, [updateBallot]);

  const { styles } = useStyles();

  const RequestProgress = useCallback(
    () => <UnstyledRequestProgress style={styles.requestProgress} />,
    [UnstyledRequestProgress],
  );

  return { ballot, RequestProgress };
}
