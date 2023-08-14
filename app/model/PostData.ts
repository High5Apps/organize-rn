import { useEffect, useState } from 'react';
import { useUserContext } from './UserContext';
import { Post, isCurrentUserData } from './types';
import { fetchPosts } from '../networking';

export default function usePostData() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [ready, setReady] = useState<boolean>(false);

  const { currentUser } = useUserContext();

  async function fetchNewestPosts() {
    if (!isCurrentUserData(currentUser)) {
      throw new Error('Expected currentUser to be set');
    }

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { errorMessage, posts: fetchedPosts } = await fetchPosts({
      jwt, sort: 'new',
    });

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    setPosts(fetchedPosts ?? []);
    setReady(true);
  }

  useEffect(() => {
    fetchNewestPosts().catch(console.error);
  }, []);

  return { posts, fetchNewestPosts, ready };
}
