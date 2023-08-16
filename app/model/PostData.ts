import { useEffect, useState } from 'react';
import { useUserContext } from './UserContext';
import { Post, isCurrentUserData } from './types';
import { fetchPosts } from '../networking';

export default function usePostData() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [ready, setReady] = useState<boolean>(false);
  const [reachedOldest, setReachedOldest] = useState<boolean>(false);

  const { currentUser } = useUserContext();

  async function fetchNewestPosts() {
    if (!isCurrentUserData(currentUser)) {
      throw new Error('Expected currentUser to be set');
    }

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const {
      errorMessage, paginationData, posts: fetchedPosts,
    } = await fetchPosts({ jwt, sort: 'new' });

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    setPosts(fetchedPosts ?? []);
    setReachedOldest(paginationData?.nextPage === null);
    setReady(true);
  }

  async function fetchNextNewerPosts() {
    if (!isCurrentUserData(currentUser)) {
      throw new Error('Expected currentUser to be set');
    }

    const jwt = await currentUser.createAuthToken({ scope: '*' });

    const firstPost = posts.length > 0 ? posts[0] : undefined;
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

    setPosts([...reversedPosts, ...posts]);
  }

  async function fetchNextOlderPosts() {
    if (!isCurrentUserData(currentUser)) {
      throw new Error('Expected currentUser to be set');
    }

    const jwt = await currentUser.createAuthToken({ scope: '*' });

    const lastPost = posts.length > 0 ? posts.at(-1) : undefined;
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

    setPosts([...posts, ...olderPostsWithoutDuplicates]);
  }

  useEffect(() => {
    fetchNewestPosts().catch(console.error);
  }, []);

  return {
    fetchNextNewerPosts, fetchNextOlderPosts, posts, reachedOldest, ready,
  };
}
