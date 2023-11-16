import { useMemo, useState } from 'react';
import { fetchBallots } from '../networking';
import { useBallotContext } from './BallotContext';
import { useUserContext } from './UserContext';
import { isCurrentUserData, isDefined } from './types';
import { getIdsFrom } from './ModelCache';

// Page indexing is 1-based, not 0-based
const firstPageIndex = 1;

export default function useBallots() {
  const { cacheBallots, getCachedBallot } = useBallotContext();
  const [activeBallotIds, setActiveBallotIds] = useState<string[]>([]);
  const activeBallots = useMemo(
    () => activeBallotIds.map(getCachedBallot).filter(isDefined),
    [activeBallotIds, getCachedBallot],
  );
  const [inactiveBallotIds, setInactiveBallotIds] = useState<string[]>([]);
  const inactiveBallots = useMemo(
    () => inactiveBallotIds.map(getCachedBallot).filter(isDefined),
    [inactiveBallotIds, getCachedBallot],
  );
  const [activeCutoff, setActiveCutoff] = useState<Date>(new Date());
  const [fetchedLastPage, setFetchedLastPage] = useState<boolean>(false);
  const [nextPageNumber, setNextPageNumber] = useState<number>(firstPageIndex);
  const [ready, setReady] = useState<boolean>(false);

  const { currentUser } = useUserContext();

  async function fetchFirstPageOfBallots() {
    if (!isCurrentUserData(currentUser)) {
      throw new Error('Expected current user to be set');
    }

    const now = new Date();
    setActiveCutoff(now);

    const activeJwt = await currentUser.createAuthToken({ scope: '*' });
    const inactiveJwt = await currentUser.createAuthToken({ scope: '*' });
    const { e2eDecryptMany } = currentUser;
    const [
      { ballots: fetchedActiveBallots, errorMessage: activeErrorMessage },
      {
        ballots: fetchedInactiveBallots, errorMessage: inactiveErrorMessage,
        paginationData,
      },
    ] = await Promise.all([
      fetchBallots({
        activeAt: now,
        createdBefore: now,
        e2eDecryptMany,
        jwt: activeJwt,
        sort: 'active',
      }),
      fetchBallots({
        createdBefore: now,
        e2eDecryptMany,
        inactiveAt: now,
        jwt: inactiveJwt,
        page: firstPageIndex,
        sort: 'inactive',
      }),
    ]);

    if (activeErrorMessage !== undefined) {
      throw new Error(activeErrorMessage);
    }

    if (inactiveErrorMessage !== undefined) {
      throw new Error(inactiveErrorMessage);
    }

    const hasNextPage = paginationData && paginationData.nextPage !== null;
    const result = { hasNextPage };

    cacheBallots(fetchedActiveBallots);
    cacheBallots(fetchedInactiveBallots);
    setActiveBallotIds(getIdsFrom(fetchedActiveBallots));
    setInactiveBallotIds(getIdsFrom(fetchedInactiveBallots));
    setNextPageNumber(firstPageIndex + 1);
    setFetchedLastPage(!hasNextPage);
    setReady(true);

    return result;
  }

  async function fetchNextPageOfBallots() {
    if (!isCurrentUserData(currentUser)) {
      throw new Error('Expected current user to be set');
    }

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { e2eDecryptMany } = currentUser;

    const {
      errorMessage, ballots: fetchedBallots, paginationData,
    } = await fetchBallots({
      createdBefore: activeCutoff,
      inactiveAt: activeCutoff,
      e2eDecryptMany,
      jwt,
      page: nextPageNumber,
      sort: 'inactive',
    });

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    const hasNextPage = paginationData && paginationData.nextPage !== null;
    const result = { hasNextPage };

    if (!fetchedBallots?.length) { return result; }

    cacheBallots(fetchedBallots);
    setNextPageNumber((pageNumber) => pageNumber + 1);
    setInactiveBallotIds([...inactiveBallotIds, ...getIdsFrom(fetchedBallots)]);

    return result;
  }

  return {
    activeBallots,
    inactiveBallots,
    fetchedLastPage,
    fetchFirstPageOfBallots,
    fetchNextPageOfBallots,
    ready,
  };
}
