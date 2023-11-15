import { useMemo, useState } from 'react';
import { fetchBallots } from '../networking';
import { useBallotContext } from './BallotContext';
import { useUserContext } from './UserContext';
import { isCurrentUserData, isDefined } from './types';
import { getIdsFrom } from './ModelCache';

export default function useBallots() {
  const { cacheBallots, getCachedBallot } = useBallotContext();
  const [ballotIds, setBallotIds] = useState<string[]>([]);
  const ballots = useMemo(
    () => ballotIds.map(getCachedBallot).filter(isDefined),
    [ballotIds, getCachedBallot],
  );
  const [ready, setReady] = useState<boolean>(false);

  const { currentUser } = useUserContext();

  async function fetchFirstPageOfBallots() {
    if (!isCurrentUserData(currentUser)) {
      throw new Error('Expected current user to be set');
    }

    const now = new Date();
    const activeJwt = await currentUser.createAuthToken({ scope: '*' });
    const inactiveJwt = await currentUser.createAuthToken({ scope: '*' });
    const { e2eDecryptMany } = currentUser;
    const [
      { ballots: activeBallots, errorMessage: activeErrorMessage },
      { ballots: inactiveBallots, errorMessage: inactiveErrorMessage },
    ] = await Promise.all([
      fetchBallots({
        activeAt: now, e2eDecryptMany, jwt: activeJwt, sort: 'active',
      }),
      fetchBallots({
        e2eDecryptMany, inactiveAt: now, jwt: inactiveJwt, sort: 'inactive',
      }),
    ]);

    if (activeErrorMessage !== undefined) {
      throw new Error(activeErrorMessage);
    }

    if (inactiveErrorMessage !== undefined) {
      throw new Error(inactiveErrorMessage);
    }

    const fetchedBallots = [...activeBallots!, ...inactiveBallots!];
    cacheBallots(fetchedBallots);
    setBallotIds(getIdsFrom(fetchedBallots));
    setReady(true);
  }

  return { ballots, fetchFirstPageOfBallots, ready };
}
