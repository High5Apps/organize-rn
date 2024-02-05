import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { StyleSheet } from 'react-native';
import useTheme from '../../Theme';
import useRequestProgress from './RequestProgress';
import {
  Ballot, GENERIC_ERROR_MESSAGE, Result, isCurrentUserData, useUserContext,
} from '../../model';
import { fetchBallot } from '../../networking';
import { RankedResult } from './types';

const useStyles = () => {
  const { spacing } = useTheme();

  const styles = StyleSheet.create({
    requestProgress: {
      margin: spacing.m,
    },
  });

  return { styles };
};

// This accounts for downranking ties to the lowest rank.
// e.g. With sorted vote counts [5, 1, 1, 0], the ranks would be [0, 2, 2, 3]
// For results from worst to best:
//   If next worst exists and has the same vote count as current
//     Set current rank to be the same as next worst's rank
//   Otherwise
//     Set current rank as the current index
export function getRankedResults(ballot?: Ballot): RankedResult[] | undefined {
  if (!ballot?.results) { return undefined; }

  const resultMap: { [key: string]: RankedResult } = {};

  const reversedResults = [...ballot.results].reverse();
  const resultCount = reversedResults.length;
  reversedResults.forEach(({ candidateId, voteCount }, i) => {
    const candidate = ballot.candidates.find(({ id }) => id === candidateId);
    if (!candidate) { return; }

    let rank = (resultCount - i - 1);
    const nextWorstResult: Result | undefined = reversedResults[i - 1];
    if (nextWorstResult) {
      const nextWorstRankedResult = resultMap[nextWorstResult.candidateId];
      const isTiedWithNext = nextWorstRankedResult.voteCount === voteCount;
      if (nextWorstRankedResult && isTiedWithNext) {
        rank = nextWorstRankedResult.rank;
      }
    }

    resultMap[candidateId] = { candidate, rank, voteCount };
  });

  return ballot.results.map(({ candidateId }) => resultMap[candidateId]);
}

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

  const rankedResults: RankedResult[] | undefined = useMemo(() => (
    getRankedResults(ballot)
  ), [ballot]);

  return { ballot, rankedResults, RequestProgress };
}
