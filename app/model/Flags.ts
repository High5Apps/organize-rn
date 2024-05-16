import { useState } from 'react';
import useCurrentUser from './CurrentUser';
import { Flag, FlagSort } from './types';
import { fetchFlags } from '../networking';
import { useFlagContext } from '../context';
import { getIdsFrom } from './ModelCache';
import useModels from './Models';

// Page indexing is 1-based, not 0-based
const firstPageIndex = 1;

type Props = {
  sort: FlagSort;
};

type FetchPageReturn = {
  hasNextPage: boolean;
};

export default function useFlags({ sort }: Props) {
  const { cacheFlag, cacheFlags, getCachedFlag } = useFlagContext();
  const {
    ids: flagsIds, models: flags, setIds: setFlagIds,
  } = useModels<Flag>({ getCachedModel: getCachedFlag });
  const [ready, setReady] = useState<boolean>(false);
  const [fetchedLastPage, setFetchedLastPage] = useState<boolean>(false);
  const [createdAtOrBefore, setCreatedAtOrBefore] = useState<Date>(new Date());
  const [nextPageNumber, setNextPageNumber] = useState<number>(firstPageIndex);

  const { currentUser } = useCurrentUser();

  async function fetchFirstPageOfFlags(): Promise<FetchPageReturn> {
    if (!currentUser) { throw new Error('Expected current user to be set'); }

    const now = new Date();
    setCreatedAtOrBefore(now);

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { e2eDecryptMany } = currentUser;
    const {
      errorMessage, paginationData, flags: fetchedFlags,
    } = await fetchFlags({
      createdAtOrBefore: now,
      e2eDecryptMany,
      page: firstPageIndex,
      jwt,
      sort,
    });

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    cacheFlags(fetchedFlags);
    setNextPageNumber(firstPageIndex + 1);
    setFlagIds(getIdsFrom(fetchedFlags));
    const hasNextPage = paginationData?.nextPage !== null;
    setFetchedLastPage(!hasNextPage);
    setReady(true);

    return { hasNextPage };
  }

  async function fetchNextPageOfFlags(): Promise<FetchPageReturn> {
    if (!currentUser) { throw new Error('Expected current user to be set'); }

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { e2eDecryptMany } = currentUser;

    const {
      errorMessage, paginationData, flags: fetchedFlags,
    } = await fetchFlags({
      createdAtOrBefore,
      e2eDecryptMany,
      jwt,
      page: nextPageNumber,
      sort,
    });

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    const hasNextPage = paginationData?.nextPage !== null;
    setFetchedLastPage(!hasNextPage);

    const result = { hasNextPage };

    if (!fetchedFlags?.length) { return result; }

    cacheFlags(fetchedFlags);
    setNextPageNumber((pageNumber) => pageNumber + 1);
    setFlagIds([...flagsIds, ...getIdsFrom(fetchedFlags)]);

    return result;
  }

  return {
    cacheFlag,
    fetchedLastPage,
    fetchFirstPageOfFlags,
    fetchNextPageOfFlags,
    getCachedFlag,
    flags,
    ready,
  };
}
