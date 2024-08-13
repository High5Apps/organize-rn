import { useCallback, useMemo } from 'react';
import { fetchBallot } from '../networking';
import { useBallotContext } from './context';
import useCurrentUser from './CurrentUser';
import type { Ballot } from './types';
import getErrorMessage from './ErrorMessage';

export default function useBallot(ballotId: string) {
  const { cacheBallot, getCachedBallot } = useBallotContext();

  const ballot = useMemo(
    () => getCachedBallot(ballotId),
    [ballotId, getCachedBallot],
  );

  const { currentUser } = useCurrentUser();

  const updateBallot = useCallback(async () => {
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
      errorMessage = getErrorMessage(error);
    }

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    } else if (fetchedBallot) {
      cacheBallot(fetchedBallot);
    }
  }, [ballotId, currentUser]);

  return {
    ballot, cacheBallot, getCachedBallot, updateBallot,
  };
}
