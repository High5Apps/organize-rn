import { useEffect, useState } from 'react';
import { useUserContext } from './UserContext';
import { Post, isCurrentUserData } from './types';
import { fetchPosts } from '../networking';

export default function usePostData() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [ready, setReady] = useState<boolean>(false);

  const { currentUser } = useUserContext();

  async function updatePosts() {
    if (!isCurrentUserData(currentUser)) {
      throw new Error('Expected currentUser to be set');
    }

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { errorMessage, posts: fetchedPosts } = await fetchPosts({ jwt });

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    return fetchedPosts ?? [];
  }

  useEffect(() => {
    updatePosts()
      .then((updatedPosts) => {
        setPosts(updatedPosts);
        setReady(true);
      })
      .catch(console.error);
  }, []);

  return { posts, updatePosts, ready };
}
