import React, { useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import useTheme from '../../Theme';
import { Ballot, getErrorMessage, useBallot } from '../../model';
import useRequestProgress from './RequestProgress';
import { useTranslation } from '../../i18n';

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
  const {
    ballot, cacheBallot, refreshBallot, updateResultOptimistically,
  } = useBallot(ballotId);

  const {
    RequestProgress: UnstyledRequestProgress, setLoading, setResult,
  } = useRequestProgress();

  const { t } = useTranslation();

  useEffect(() => {
    async function wrappedUpdateBallot() {
      setResult('none');
      setLoading(true);

      try {
        await refreshBallot();
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        setResult('error', {
          message: t('result.error.tapToRetry', { errorMessage }),
          onPress: wrappedUpdateBallot,
        });
      } finally {
        setLoading(false);
      }
    }

    if (shouldFetchOnMount(ballot)) {
      wrappedUpdateBallot();
    }
  }, [t]);

  const { styles } = useStyles();

  const RequestProgress = useCallback(
    () => <UnstyledRequestProgress style={styles.requestProgress} />,
    [UnstyledRequestProgress],
  );

  return {
    ballot, cacheBallot, RequestProgress, updateResultOptimistically,
  };
}
