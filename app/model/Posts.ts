import { useMemo, useState } from 'react';
import { useUserContext } from './UserContext';
import { PostCategory, PostSort, isDefined } from './types';
import { fetchPosts } from '../networking';
import { usePostContext } from './PostContext';
import { getIdsFrom } from './ModelCache';

// Page indexing is 1-based, not 0-based
const firstPageIndex = 1;

type Props = {
  category?: PostCategory;
  sort?: PostSort;
};

type FetchPageReturn = {
  hasNextPage: boolean;
};

export default function usePosts({ category, sort: maybeSort }: Props = {}) {
  const sort = maybeSort ?? 'new';

  const { cachePost, cachePosts, getCachedPost } = usePostContext();
  const [postIds, setPostIds] = useState<string[]>([]);
  const posts = useMemo(
    () => postIds.map(getCachedPost).filter(isDefined),
    [postIds, getCachedPost],
  );
  const [ready, setReady] = useState<boolean>(false);
  const [fetchedLastPage, setFetchedLastPage] = useState<boolean>(false);
  const [createdAtOrBefore, setCreatedAtOrBefore] = useState<Date>(new Date());
  const [nextPageNumber, setNextPageNumber] = useState<number>(firstPageIndex);

  const { currentUser } = useUserContext();

  async function fetchFirstPageOfPosts(): Promise<FetchPageReturn> {
    if (!currentUser) { throw new Error('Expected current user to be set'); }

    const now = new Date();
    setCreatedAtOrBefore(now);

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { e2eDecryptMany } = currentUser;
    const {
      errorMessage, paginationData, posts: fetchedPosts,
    } = await fetchPosts({
      category,
      createdAtOrBefore: now,
      e2eDecryptMany,
      page: firstPageIndex,
      jwt,
      sort,
    });

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    cachePosts(fetchedPosts);
    setNextPageNumber(firstPageIndex + 1);
    setPostIds(getIdsFrom(fetchedPosts));
    const hasNextPage = paginationData?.nextPage !== null;
    setFetchedLastPage(!hasNextPage);
    setReady(true);

    return { hasNextPage };
  }

  async function fetchNextPageOfPosts(): Promise<FetchPageReturn> {
    if (!currentUser) { throw new Error('Expected current user to be set'); }

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { e2eDecryptMany } = currentUser;

    const {
      errorMessage, paginationData, posts: fetchedPosts,
    } = await fetchPosts({
      category,
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

    if (!fetchedPosts?.length) { return result; }

    cachePosts(fetchedPosts);
    setNextPageNumber((pageNumber) => pageNumber + 1);
    setPostIds([...postIds, ...getIdsFrom(fetchedPosts)]);

    return result;
  }

  return {
    cachePost,
    fetchedLastPage,
    fetchFirstPageOfPosts,
    fetchNextPageOfPosts,
    getCachedPost,
    posts,
    ready,
  };
}
