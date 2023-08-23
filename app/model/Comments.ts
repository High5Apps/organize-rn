import { useEffect, useState } from 'react';
import { Comment, isCurrentUserData } from './types';
import { useUserContext } from './UserContext';
import { fetchComments } from '../networking';

export default function useComments(postId?: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [ready, setReady] = useState<boolean>(false);

  const { currentUser } = useUserContext();

  useEffect(() => {
    if (!postId) { return; }

    async function updateComments() {
      if (!isCurrentUserData(currentUser) || !postId) { return; }

      const jwt = await currentUser.createAuthToken({ scope: '*' });
      const {
        errorMessage, comments: fetchedComments,
      } = await fetchComments({ jwt, postId });

      if (errorMessage !== undefined) {
        throw new Error(errorMessage);
      }

      setComments(fetchedComments);
      setReady(true);
    }

    updateComments().catch(console.error);
  }, [postId]);

  return { comments, ready };
}
