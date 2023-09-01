import { useState } from 'react';
import { useUserContext } from './UserContext';
import { Post, isCurrentUserData, isDefined } from './types';
import { fetchPosts } from '../networking';
import { usePostContext } from './PostContext';

const getPostIdsFrom = (posts?: Post[]) => (posts ?? []).map((post) => post.id);

export default function usePosts() {
  const { cachePosts, getCachedPost } = usePostContext();
  const [postIds, setPostIds] = useState<string[]>([]);
  const posts = postIds.map(getCachedPost).filter(isDefined);
  const [ready, setReady] = useState<boolean>(false);
  const [reachedOldest, setReachedOldest] = useState<boolean>(false);

  const { currentUser } = useUserContext();

  async function fetchNewestPosts() {
    if (!isCurrentUserData(currentUser)) { return; }

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const {
      errorMessage, paginationData, posts: fetchedPosts,
    } = await fetchPosts({ jwt, sort: 'new' });

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    cachePosts(fetchedPosts);
    setPostIds(getPostIdsFrom(fetchedPosts));
    setReachedOldest(paginationData?.nextPage === null);
    setReady(true);
  }

  async function fetchNextNewerPosts() {
    if (!isCurrentUserData(currentUser)) { return; }

    const jwt = await currentUser.createAuthToken({ scope: '*' });

    const firstPost = postIds.length > 0
      ? getCachedPost(postIds[0]) : undefined;
    const createdAfter = firstPost?.createdAt;
    const { errorMessage, posts: fetchedPosts } = await fetchPosts({
      createdAfter, jwt, sort: 'old',
    });

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    if (!fetchedPosts?.length) { return; }

    // Due to millisecond rounding errors, it's possible that the previously
    // newest post could be included again in the returned posts. If needed, the
    // following code filters it out.
    const indexOfDuplicate = fetchedPosts.findIndex((post) => (
      post.id === firstPost?.id
    ));
    const newerPostsWithoutDuplicates = (indexOfDuplicate === -1)
      ? fetchedPosts : fetchedPosts.slice(1 + indexOfDuplicate);

    // Need to reverse posts since they were fetched oldest first
    const reversedPosts = newerPostsWithoutDuplicates.reverse();

    cachePosts(reversedPosts);
    setPostIds([...getPostIdsFrom(reversedPosts), ...postIds]);
  }

  async function fetchNextOlderPosts() {
    if (!isCurrentUserData(currentUser)) { return; }

    const jwt = await currentUser.createAuthToken({ scope: '*' });

    const lastPost = postIds.length > 0
      ? getCachedPost(postIds.at(-1)!) : undefined;
    const createdBefore = lastPost?.createdAt;
    const {
      errorMessage, paginationData, posts: fetchedPosts,
    } = await fetchPosts({ createdBefore, jwt, sort: 'new' });

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    setReachedOldest(paginationData?.nextPage === null);

    if (!fetchedPosts?.length) { return; }

    // Due to millisecond rounding errors, it's possible that the previously
    // oldest post could be included again in the returned posts. If needed, the
    // following code filters it out.
    const indexOfDuplicate = fetchedPosts.findIndex((post) => (
      post.id === lastPost?.id
    ));
    const olderPostsWithoutDuplicates = (indexOfDuplicate === -1)
      ? fetchedPosts : fetchedPosts.slice(1 + indexOfDuplicate);

    cachePosts(olderPostsWithoutDuplicates);
    setPostIds([...postIds, ...getPostIdsFrom(olderPostsWithoutDuplicates)]);
  }

  return {
    fetchNewestPosts,
    fetchNextNewerPosts,
    fetchNextOlderPosts,
    getCachedPost,
    posts,
    reachedOldest,
    ready,
  };
}
