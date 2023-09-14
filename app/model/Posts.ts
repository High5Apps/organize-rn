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

type Props = {
  category?: PostCategory;
  sort?: PostSort;
};

export default function usePosts({ category, sort: maybeSort }: Props = {}) {
  const sort = maybeSort ?? 'new';

  const { cachePost, cachePosts, getCachedPost } = usePostContext();
  const [postIds, setPostIds] = useState<string[]>([]);
  const posts = postIds.map(getCachedPost).filter(isDefined);
  const [ready, setReady] = useState<boolean>(false);
  const [fetchedLastPage, setFetchedLastPage] = useState<boolean>(false);
  const [createdBefore, setCreatedBefore] = useState<number | undefined>();
  const [nextPageNumber, setNextPageNumber] = useState<number>(firstPageIndex);

  const { currentUser } = useUserContext();

  async function fetchFirstPageOfPosts() {
    if (!isCurrentUserData(currentUser)) { return; }

    const now = new Date().getTime();
    setCreatedBefore(now);

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const {
      errorMessage, paginationData, posts: fetchedPosts,
    } = await fetchPosts({
      category, createdBefore: now, page: firstPageIndex, jwt, sort,
    });

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    cachePosts(fetchedPosts);
    setNextPageNumber(firstPageIndex + 1);
    setPostIds(getPostIdsFrom(fetchedPosts));
    setFetchedLastPage(paginationData?.nextPage === null);
    setReady(true);
  }

  async function fetchNextPageOfPosts() {
    if (!isCurrentUserData(currentUser)) { return; }

    const jwt = await currentUser.createAuthToken({ scope: '*' });

    const {
      errorMessage, paginationData, posts: fetchedPosts,
    } = await fetchPosts({
      category, createdBefore, jwt, page: nextPageNumber, sort,
    });

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    setFetchedLastPage(paginationData?.nextPage === null);

    if (!fetchedPosts?.length) { return; }

    cachePosts(fetchedPosts);
    setNextPageNumber((pageNumber) => pageNumber + 1);
    setPostIds([...postIds, ...getPostIdsFrom(fetchedPosts)]);
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
