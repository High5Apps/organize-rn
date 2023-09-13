import { useState } from 'react';
import { useUserContext } from './UserContext';
import {
  Post, PostCategory, PostSort, isCurrentUserData, isDefined,
} from './types';
import { fetchPosts } from '../networking';
import { usePostContext } from './PostContext';

const getPostIdsFrom = (posts?: Post[]) => (posts ?? []).map((post) => post.id);

type Props = {
  category?: PostCategory;
  sort?: PostSort;
};

function reverse(sort: PostSort): PostSort | null {
  if (sort === 'new') {
    return 'old';
  }

  if (sort === 'old') {
    return 'new';
  }

  return null;
}

export default function usePosts({ category, sort: maybeSort }: Props = {}) {
  const sort = maybeSort ?? 'new';

  const { cachePost, cachePosts, getCachedPost } = usePostContext();
  const [postIds, setPostIds] = useState<string[]>([]);
  const posts = postIds.map(getCachedPost).filter(isDefined);
  const [ready, setReady] = useState<boolean>(false);
  const [fetchedLastPage, setFetchedLastPage] = useState<boolean>(false);

  const { currentUser } = useUserContext();

  async function fetchFirstPageOfPosts() {
    if (!isCurrentUserData(currentUser)) { return; }

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const {
      errorMessage, paginationData, posts: fetchedPosts,
    } = await fetchPosts({ category, jwt, sort });

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    cachePosts(fetchedPosts);
    setPostIds(getPostIdsFrom(fetchedPosts));
    setFetchedLastPage(paginationData?.nextPage === null);
    setReady(true);
  }

  async function fetchPreviousPageOfPosts() {
    if (!isCurrentUserData(currentUser)) { return; }

    // The idea of a "previous" page of posts only makes sense for new/old. All
    // other sorts should update the first page instead.
    const reverseSort = reverse(sort);
    if (reverseSort === null) {
      await fetchFirstPageOfPosts();
      return;
    }

    const jwt = await currentUser.createAuthToken({ scope: '*' });

    const firstPost = postIds.length > 0
      ? getCachedPost(postIds[0]) : undefined;
    const createdAfter = firstPost?.createdAt;
    const { errorMessage, posts: fetchedPosts } = await fetchPosts({
      category, createdAfter, jwt, sort: reverseSort,
    });

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    if (!fetchedPosts?.length) { return; }

    // Due to millisecond rounding errors, it's possible that the previously
    // first post could be included again in the returned posts. If needed, the
    // following code filters it out.
    const indexOfDuplicate = fetchedPosts.findIndex((post) => (
      post.id === firstPost?.id
    ));
    const previousPostsWithoutDuplicates = (indexOfDuplicate === -1)
      ? fetchedPosts : fetchedPosts.slice(1 + indexOfDuplicate);

    // Need to reverse posts since they were fetched in reverse order
    const reversedPosts = previousPostsWithoutDuplicates.reverse();

    cachePosts(reversedPosts);
    setPostIds([...getPostIdsFrom(reversedPosts), ...postIds]);
  }

  async function fetchNextPageOfPosts() {
    if (!isCurrentUserData(currentUser)) { return; }

    const jwt = await currentUser.createAuthToken({ scope: '*' });

    const lastPost = postIds.length > 0
      ? getCachedPost(postIds.at(-1)!) : undefined;
    const createdBefore = lastPost?.createdAt;
    const {
      errorMessage, paginationData, posts: fetchedPosts,
    } = await fetchPosts({
      category, createdBefore, jwt, sort,
    });

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    setFetchedLastPage(paginationData?.nextPage === null);

    if (!fetchedPosts?.length) { return; }

    // Due to millisecond rounding errors, it's possible that the previously
    // last post could be included again in the returned posts. If needed, the
    // following code filters it out.
    const indexOfDuplicate = fetchedPosts.findIndex((post) => (
      post.id === lastPost?.id
    ));
    const nextPostsWithoutDuplicates = (indexOfDuplicate === -1)
      ? fetchedPosts : fetchedPosts.slice(1 + indexOfDuplicate);

    cachePosts(nextPostsWithoutDuplicates);
    setPostIds([...postIds, ...getPostIdsFrom(nextPostsWithoutDuplicates)]);
  }

  return {
    cachePost,
    fetchedLastPage,
    fetchFirstPageOfPosts,
    fetchNextPageOfPosts,
    fetchPreviousPageOfPosts,
    getCachedPost,
    posts,
    ready,
  };
}
