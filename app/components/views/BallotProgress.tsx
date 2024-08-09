import React, { useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import useTheme from '../../Theme';
import { Ballot, getErrorMessage } from '../../model';
import { useBallot } from '../hooks';
import useRequestProgress from './RequestProgress';

const useStyles = () => {
  const { spacing } = useTheme();

  const styles = StyleSheet.create({
    requestProgress: {
      margin: spacing.m,
    },
  });

  return { styles };
};

type Props = {
  ballotId: string;
  shouldFetchOnMount: (cachedBallot?: Ballot) => boolean;
};

export default function useBallotProgress({
  ballotId, shouldFetchOnMount,
}: Props) {
  const { ballot, cacheBallot, updateBallot } = useBallot(ballotId);

  const {
    RequestProgress: UnstyledRequestProgress, setLoading, setResult,
  } = useRequestProgress();

  useEffect(() => {
    async function wrappedUpdateBallot() {
      setResult('none');
      setLoading(true);

      try {
        await updateBallot();
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        setResult('error', {
          message: `${errorMessage}\nTap here to try again`,
          onPress: wrappedUpdateBallot,
        });
      } finally {
        setLoading(false);
      }
    }

    if (shouldFetchOnMount(ballot)) {
      wrappedUpdateBallot();
    }
  }, []);

  const { styles } = useStyles();

  const RequestProgress = useCallback(
    () => <UnstyledRequestProgress style={styles.requestProgress} />,
    [UnstyledRequestProgress],
  );

  return { ballot, cacheBallot, RequestProgress };
}
