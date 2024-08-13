import { useState } from 'react';
import { fetchUsers } from '../networking';
import { useUserContext } from './context';
import { User, UserFilter, UserSort } from './types';
import { getIdsFrom } from './ModelCache';
import useCurrentUser from './CurrentUser';
import useModels from './Models';

// Page indexing is 1-based, not 0-based
const firstPageIndex = 1;

type Props = {
  filter?: UserFilter;
  query?: string;
  sort: UserSort;
};

export default function useUsers({ filter, query, sort }: Props) {
  const { cacheUser, cacheUsers, getCachedUser } = useUserContext();
  const {
    ids: userIds, models: users, setIds: setUserIds,
  } = useModels<User>({ getCachedModel: getCachedUser });
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
      filter, joinedAtOrBefore: now, jwt, page: firstPageIndex, query, sort,
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
      filter, joinedAtOrBefore, jwt, page: nextPageNumber, query, sort,
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
