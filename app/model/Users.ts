import { useMemo, useState } from 'react';
import { fetchUsers } from '../networking';
import { useUserContext } from '../context';
import { UserFilter, UserSort, isDefined } from './types';
import { getIdsFrom } from './ModelCache';
import useCurrentUser from './CurrentUser';

// Page indexing is 1-based, not 0-based
const firstPageIndex = 1;

type Props = {
  filter?: UserFilter;
  sort: UserSort;
};

export default function useUsers({ filter, sort }: Props) {
  const { cacheUser, cacheUsers, getCachedUser } = useUserContext();
  const [userIds, setUserIds] = useState<string[]>([]);
  const users = useMemo(
    () => userIds.map(getCachedUser).filter(isDefined),
    [userIds, getCachedUser],
  );
  const [fetchedLastPage, setFetchedLastPage] = useState<boolean>(false);
  const [joinedAtOrBefore, setJoinedAtOrBefore] = useState<Date>(new Date());
  const [nextPageNumber, setNextPageNumber] = useState<number>(firstPageIndex);
  const [ready, setReady] = useState<boolean>(false);

  const { currentUser } = useCurrentUser();

  async function fetchFirstPageOfUsers() {
    if (!currentUser) { throw new Error('Expected current user to be set'); }

    const now = new Date();
    setJoinedAtOrBefore(now);

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const {
      errorMessage, paginationData, users: fetchedUsers,
    } = await fetchUsers({
      filter, joinedAtOrBefore: now, jwt, page: firstPageIndex, sort,
    });

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    const hasNextPage = !!paginationData && paginationData.nextPage !== null;
    setFetchedLastPage(!hasNextPage);

    const result = { hasNextPage };

    cacheUsers(fetchedUsers);
    setUserIds(getIdsFrom(fetchedUsers));
    setNextPageNumber(firstPageIndex + 1);
    setReady(true);

    return result;
  }

  async function fetchNextPageOfUsers() {
    if (!currentUser) { throw new Error('Expected current user to be set'); }

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const {
      errorMessage, paginationData, users: fetchedUsers,
    } = await fetchUsers({
      filter, joinedAtOrBefore, jwt, page: nextPageNumber, sort,
    });

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    const hasNextPage = !!paginationData && paginationData.nextPage !== null;
    setFetchedLastPage(!hasNextPage);

    const result = { hasNextPage };

    if (!fetchedUsers?.length) { return result; }

    cacheUsers(fetchedUsers);
    setNextPageNumber((pageNumber) => pageNumber + 1);
    setUserIds([...userIds, ...getIdsFrom(fetchedUsers)]);

    return result;
  }

  return {
    cacheUser,
    fetchedLastPage,
    fetchFirstPageOfUsers,
    fetchNextPageOfUsers,
    getCachedUser,
    ready,
    users,
  };
}
