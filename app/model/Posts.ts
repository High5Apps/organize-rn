import { useState } from 'react';
import useCurrentUser from './CurrentUser';
import { Post, PostCategory, PostSort } from './types';
import { fetchPosts } from '../networking';
import { usePostContext } from '../context';
import { getIdsFrom } from './ModelCache';
import useModels from './Models';

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

  const {
    cachePost, cachePosts, getCachedPost, getCachedPosts,
  } = usePostContext();

  const {
    ids: postIds, models: posts, setIds: setPostIds,
  } = useModels<Post>({ getCachedModel: getCachedPost });
  const [ready, setReady] = useState<boolean>(false);
  const [fetchedLastPage, setFetchedLastPage] = useState<boolean>(false);
  const [createdAtOrBefore, setCreatedAtOrBefore] = useState<Date>(new Date());
  const [nextPageNumber, setNextPageNumber] = useState<number>(firstPageIndex);

  const { currentUser } = useCurrentUser();

  async function fetchFirstPageOfPosts(): Promise<FetchPageReturn> {
    if (!currentUser) { throw new Error('Expected current user to be set'); }

    const now = new Date();
    setCreatedAtOrBefore(now);

    const {
      posts: cachedPosts, paginationData: { nextPage: nextCachePage },
    } = getCachedPosts({ category, page: firstPageIndex, sort });
    setPostIds(getIdsFrom(cachedPosts));

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { e2eDecryptMany } = currentUser;

    let errorMessage;
    let paginationData;
    let fetchedPosts;
    try {
      ({
        errorMessage, paginationData, posts: fetchedPosts,
      } = await fetchPosts({
        category,
        createdAtOrBefore: now,
        e2eDecryptMany,
        page: firstPageIndex,
        jwt,
        sort,
      }));

      if (errorMessage) {
        throw new Error(errorMessage);
      }

      cachePosts(fetchedPosts);
      setPostIds(getIdsFrom(fetchedPosts));
    } catch (error) {
      console.error(error);

      if (!cachedPosts.length) {
        throw error;
      }

      fetchedPosts = cachedPosts;
      paginationData = {
        nextPage: nextCachePage,
      };
    }

    setNextPageNumber(firstPageIndex + 1);
    const hasNextPage = paginationData?.nextPage !== null;
    setFetchedLastPage(!hasNextPage);
    setReady(true);

    return { hasNextPage };
  }

  async function fetchNextPageOfPosts(): Promise<FetchPageReturn> {
    if (!currentUser) { throw new Error('Expected current user to be set'); }

    const {
      posts: cachedPosts, paginationData: { nextPage: nextCachePage },
    } = getCachedPosts({ category, page: nextPageNumber, sort });
    setPostIds([...postIds, ...getIdsFrom(cachedPosts)]);

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { e2eDecryptMany } = currentUser;

    let errorMessage;
    let paginationData;
    let fetchedPosts: Post[] | undefined;
    try {
      ({
        errorMessage, paginationData, posts: fetchedPosts,
      } = await fetchPosts({
        category,
        createdAtOrBefore,
        e2eDecryptMany,
        jwt,
        page: nextPageNumber,
        sort,
      }));

      if (errorMessage) {
        throw new Error(errorMessage);
      }

      cachePosts(fetchedPosts);
      setPostIds([...postIds, ...getIdsFrom(fetchedPosts)]);
    } catch (error) {
      console.error(error);
      fetchedPosts = cachedPosts;
      paginationData = {
        nextPage: nextCachePage,
      };
    }

    const hasNextPage = paginationData?.nextPage !== null;
    setFetchedLastPage(!hasNextPage);

    const result = { hasNextPage };

    if (!fetchedPosts?.length) { return result; }

    setNextPageNumber((pageNumber) => pageNumber + 1);

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
