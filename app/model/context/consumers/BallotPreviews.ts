import { useState } from 'react';
import { fetchBallotPreviews } from '../../../networking';
import { useBallotPreviewContext } from '../providers';
import useCurrentUser from './CurrentUser';
import { BallotPreview } from '../../types';
import useModels, { getIdsFrom } from './Models';
import i18n from '../../../i18n';

// Page indexing is 1-based, not 0-based
const firstPageIndex = 1;

export default function useBallotPreviews() {
  const {
    cacheBallotPreview, cacheBallotPreviews, getCachedBallotPreview,
  } = useBallotPreviewContext();
  const {
    models: activeBallotPreviews, setIds: setActiveBallotIds,
  } = useModels<BallotPreview>({ getCachedModel: getCachedBallotPreview });
  const {
    ids: inactiveBallotIds,
    models: inactiveBallotPreviews,
    setIds: setInactiveBallotIds,
  } = useModels<BallotPreview>({ getCachedModel: getCachedBallotPreview });
  const [activeCutoff, setActiveCutoff] = useState<Date>(new Date());
  const [fetchedLastPage, setFetchedLastPage] = useState<boolean>(false);
  const [nextPageNumber, setNextPageNumber] = useState<number>(firstPageIndex);
  const [ready, setReady] = useState<boolean>(false);

  const { currentUser } = useCurrentUser();

  async function fetchFirstPageOfBallotPreviews() {
    if (!currentUser) { throw new Error('Expected current user to be set'); }

    const now = new Date();
    setActiveCutoff(now);

    const activeJwt = await currentUser.createAuthToken({ scope: '*' });
    const inactiveJwt = await currentUser.createAuthToken({ scope: '*' });
    const { e2eDecryptMany } = currentUser;
    const [
      {
        ballotPreviews: fetchedActiveBallotPreviews,
        errorMessage: activeErrorMessage,
      },
      {
        ballotPreviews: fetchedInactiveBallotPreviews,
        errorMessage: inactiveErrorMessage,
        paginationData,
      },
    ] = await Promise.all([
      fetchBallotPreviews({
        activeAt: now,
        createdAtOrBefore: now,
        e2eDecryptMany,
        jwt: activeJwt,
        sort: 'active',
      }),
      fetchBallotPreviews({
        createdAtOrBefore: now,
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

    const hasNextPage = (paginationData !== undefined)
      && paginationData.nextPage !== null;
    setFetchedLastPage(!hasNextPage);

    const result = { hasNextPage };

    cacheBallotPreviews(fetchedActiveBallotPreviews);
    cacheBallotPreviews(fetchedInactiveBallotPreviews);
    setActiveBallotIds(getIdsFrom(fetchedActiveBallotPreviews));
    setInactiveBallotIds(getIdsFrom(fetchedInactiveBallotPreviews));
    setNextPageNumber(firstPageIndex + 1);
    setReady(true);

    return result;
  }

  async function fetchNextPageOfBallotPreviews() {
    if (!currentUser) { throw new Error('Expected current user to be set'); }

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { e2eDecryptMany } = currentUser;

    const {
      errorMessage, ballotPreviews: fetchedBallotPreviews, paginationData,
    } = await fetchBallotPreviews({
      createdAtOrBefore: activeCutoff,
      inactiveAt: activeCutoff,
      e2eDecryptMany,
      jwt,
      page: nextPageNumber,
      sort: 'inactive',
    });

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    const hasNextPage = (paginationData !== undefined)
      && paginationData.nextPage !== null;
    setFetchedLastPage(!hasNextPage);

    const result = { hasNextPage };

    if (!fetchedBallotPreviews?.length) { return result; }

    cacheBallotPreviews(fetchedBallotPreviews);
    setNextPageNumber((pageNumber) => pageNumber + 1);
    setInactiveBallotIds([
      ...inactiveBallotIds, ...getIdsFrom(fetchedBallotPreviews),
    ]);

    return result;
  }

  return {
    activeBallotPreviews,
    cacheBallotPreview,
    inactiveBallotPreviews,
    fetchedLastPage,
    fetchFirstPageOfBallotPreviews,
    fetchNextPageOfBallotPreviews,
    getCachedBallotPreview,
    ready,
  };
}

export const nominationsTimeRemainingFormatter = (timeRemaining: string) => (
  i18n.t('time.hint.remaining.nominationsEnd', { timeRemaining })
);

export const nominationsTimeRemainingExpiredFormatter = () => (
  i18n.t('time.hint.past.nominationsEnd')
);

export const votingTimeRemainingFormatter = (timeRemaining: string) => (
  i18n.t('time.hint.remaining.votingEnd', { timeRemaining })
);

export const votingTimeRemainingExpiredFormatter = () => (
  i18n.t('time.hint.past.votingEnd')
);
