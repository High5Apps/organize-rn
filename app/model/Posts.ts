import { useState } from 'react';
import { useUserContext } from './UserContext';
import {
  Post, PostCategory, PostSort, isCurrentUserData, isDefined,
} from './types';
import { fetchPosts } from '../networking';
import { usePostContext } from './PostContext';

// Page indexing is 1-based, not 0-based
const firstPageIndex = 1;

const getPostIdsFrom = (posts?: Post[]) => (posts ?? []).map((post) => post.id);

function getCreatedBefore(minimumCreatedBefore?: number) {
  const now = new Date().getTime();

  if (minimumCreatedBefore === undefined) {
    return now;
  }

  const oneMillisecondAfterMinimumCreatedBefore = 1 + minimumCreatedBefore;
  return Math.max(now, oneMillisecondAfterMinimumCreatedBefore);
}

type Props = {
  category?: PostCategory;
  minimumCreatedBefore?: number;
  sort?: PostSort;
};

type FetchPageReturn = {
  hasNextPage: boolean;
};

export default function usePosts({
  category, minimumCreatedBefore, sort: maybeSort,
}: Props = {}) {
  const sort = maybeSort ?? 'new';

  const { cachePost, cachePosts, getCachedPost } = usePostContext();
  const [postIds, setPostIds] = useState<string[]>([]);
  const posts = postIds.map(getCachedPost).filter(isDefined);
  const [ready, setReady] = useState<boolean>(false);
  const [fetchedLastPage, setFetchedLastPage] = useState<boolean>(false);
  const [createdBefore, setCreatedBefore] = useState<number | undefined>();
  const [nextPageNumber, setNextPageNumber] = useState<number>(firstPageIndex);

  const { currentUser } = useUserContext();

  async function fetchFirstPageOfPosts(): Promise<FetchPageReturn> {
    if (!isCurrentUserData(currentUser)) {
      throw new Error('Expected current user to be set');
    }

    const newCreatedBefore = getCreatedBefore(minimumCreatedBefore);

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const {
      errorMessage, paginationData, posts: fetchedPosts,
    } = await fetchPosts({
      category,
      createdBefore: newCreatedBefore,
      page: firstPageIndex,
      jwt,
      sort,
    });

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    setCreatedBefore(newCreatedBefore);
    cachePosts(fetchedPosts);
    setNextPageNumber(firstPageIndex + 1);
    setPostIds(getPostIdsFrom(fetchedPosts));
    const hasNextPage = paginationData?.nextPage !== null;
    setFetchedLastPage(!hasNextPage);
    setReady(true);

    return { hasNextPage };
  }

  async function fetchNextPageOfPosts(): Promise<FetchPageReturn> {
    if (!isCurrentUserData(currentUser)) {
      throw new Error('Expected current user to be set');
    }

    const jwt = await currentUser.createAuthToken({ scope: '*' });

    const {
      errorMessage, paginationData, posts: fetchedPosts,
    } = await fetchPosts({
      category, createdBefore, jwt, page: nextPageNumber, sort,
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
    setPostIds([...postIds, ...getPostIdsFrom(fetchedPosts)]);

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
