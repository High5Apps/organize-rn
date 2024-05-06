import { useState } from 'react';
import useCurrentUser from './CurrentUser';
import { FlaggedItem, FlaggedItemSort } from './types';
import { fetchFlaggedItems } from '../networking';
import { useFlaggedItemContext } from '../context';
import { getIdsFrom } from './ModelCache';
import useModels from './Models';

// Page indexing is 1-based, not 0-based
const firstPageIndex = 1;

type Props = {
  sort: FlaggedItemSort;
};

type FetchPageReturn = {
  hasNextPage: boolean;
};

export default function useFlaggedItems({ sort }: Props) {
  const {
    cacheFlaggedItem, cacheFlaggedItems, getCachedFlaggedItem,
  } = useFlaggedItemContext();
  const {
    ids: flaggedItemIds, models: flaggedItems, setIds: setFlaggedItemIds,
  } = useModels<FlaggedItem>({ getCachedModel: getCachedFlaggedItem });
  const [ready, setReady] = useState<boolean>(false);
  const [fetchedLastPage, setFetchedLastPage] = useState<boolean>(false);
  const [createdAtOrBefore, setCreatedAtOrBefore] = useState<Date>(new Date());
  const [nextPageNumber, setNextPageNumber] = useState<number>(firstPageIndex);

  const { currentUser } = useCurrentUser();

  async function fetchFirstPageOfFlaggedItems(): Promise<FetchPageReturn> {
    if (!currentUser) { throw new Error('Expected current user to be set'); }

    const now = new Date();
    setCreatedAtOrBefore(now);

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { e2eDecryptMany } = currentUser;
    const {
      errorMessage, paginationData, flaggedItems: fetchedFlaggedItems,
    } = await fetchFlaggedItems({
      createdAtOrBefore: now,
      e2eDecryptMany,
      page: firstPageIndex,
      jwt,
      sort,
    });

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    cacheFlaggedItems(fetchedFlaggedItems);
    setNextPageNumber(firstPageIndex + 1);
    setFlaggedItemIds(getIdsFrom(fetchedFlaggedItems));
    const hasNextPage = paginationData?.nextPage !== null;
    setFetchedLastPage(!hasNextPage);
    setReady(true);

    return { hasNextPage };
  }

  async function fetchNextPageOfFlaggedItems(): Promise<FetchPageReturn> {
    if (!currentUser) { throw new Error('Expected current user to be set'); }

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { e2eDecryptMany } = currentUser;

    const {
      errorMessage, paginationData, flaggedItems: fetchedFlaggedItems,
    } = await fetchFlaggedItems({
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

    if (!fetchedFlaggedItems?.length) { return result; }

    cacheFlaggedItems(fetchedFlaggedItems);
    setNextPageNumber((pageNumber) => pageNumber + 1);
    setFlaggedItemIds([...flaggedItemIds, ...getIdsFrom(fetchedFlaggedItems)]);

    return result;
  }

  return {
    cacheFlaggedItem,
    fetchedLastPage,
    fetchFirstPageOfFlaggedItems,
    fetchNextPageOfFlaggedItems,
    getCachedFlaggedItem,
    flaggedItems,
    ready,
  };
}
