import { useMemo, useState } from 'react';
import { fetchUserPreviews } from '../networking';
import { useUserPreviewContext } from './UserPreviewContext';
import { UserFilter, UserSort, isDefined } from './types';
import { getIdsFrom } from './ModelCache';
import useCurrentUser from './CurrentUser';

// Page indexing is 1-based, not 0-based
const firstPageIndex = 1;

type Props = {
  filter?: UserFilter;
  sort: UserSort;
};

export default function useUserPreviews({ filter, sort }: Props) {
  const {
    cacheUserPreview, cacheUserPreviews, getCachedUserPreview,
  } = useUserPreviewContext();
  const [userIds, setUserIds] = useState<string[]>([]);
  const userPreviews = useMemo(
    () => userIds.map(getCachedUserPreview).filter(isDefined),
    [userIds, getCachedUserPreview],
  );
  const [fetchedLastPage, setFetchedLastPage] = useState<boolean>(false);
  const [joinedAtOrBefore, setJoinedAtOrBefore] = useState<Date>(new Date());
  const [nextPageNumber, setNextPageNumber] = useState<number>(firstPageIndex);
  const [ready, setReady] = useState<boolean>(false);

  const { currentUser } = useCurrentUser();

  async function fetchFirstPageOfUserPreviews() {
    if (!currentUser) { throw new Error('Expected current user to be set'); }

    const now = new Date();
    setJoinedAtOrBefore(now);

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const {
      errorMessage, paginationData, userPreviews: fetchedUserPreviews,
    } = await fetchUserPreviews({
      filter, joinedAtOrBefore: now, jwt, page: firstPageIndex, sort,
    });

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    const hasNextPage = !!paginationData && paginationData.nextPage !== null;
    setFetchedLastPage(!hasNextPage);

    const result = { hasNextPage };

    cacheUserPreviews(fetchedUserPreviews);
    setUserIds(getIdsFrom(fetchedUserPreviews));
    setNextPageNumber(firstPageIndex + 1);
    setReady(true);

    return result;
  }

  async function fetchNextPageOfUserPreviews() {
    if (!currentUser) { throw new Error('Expected current user to be set'); }

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const {
      errorMessage, paginationData, userPreviews: fetchedUserPreviews,
    } = await fetchUserPreviews({
      filter, joinedAtOrBefore, jwt, page: nextPageNumber, sort,
    });

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    const hasNextPage = !!paginationData && paginationData.nextPage !== null;
    setFetchedLastPage(!hasNextPage);

    const result = { hasNextPage };

    if (!fetchedUserPreviews?.length) { return result; }

    cacheUserPreviews(fetchedUserPreviews);
    setNextPageNumber((pageNumber) => pageNumber + 1);
    setUserIds([...userIds, ...getIdsFrom(fetchedUserPreviews)]);

    return result;
  }

  return {
    cacheUserPreview,
    fetchedLastPage,
    fetchFirstPageOfUserPreviews,
    fetchNextPageOfUserPreviews,
    getCachedUserPreview,
    ready,
    userPreviews,
  };
}
