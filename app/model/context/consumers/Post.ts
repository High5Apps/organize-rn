import { useCallback, useMemo } from 'react';
import { usePostContext } from '../providers';
import useCurrentUser from './CurrentUser';
import { Post } from '../../types';
import { fetchPost } from '../../../networking';
import getErrorMessage from '../../ErrorMessage';

type Props = {
  id: string;
};

export default function usePost({ id }: Props) {
  const { cachePost, getCachedPost } = usePostContext();

  const post = useMemo(
    () => getCachedPost(id),
    [id, getCachedPost],
  );

  const { currentUser } = useCurrentUser();

  const refreshPost = useCallback(async () => {
    if (!currentUser) { throw new Error('Expected current user'); }
    const { createAuthToken, e2eDecrypt } = currentUser;

    const jwt = await createAuthToken({ scope: '*' });

    let errorMessage: string | undefined;
    let fetchedPost: Post | undefined;
    try {
      ({ post: fetchedPost, errorMessage } = await fetchPost({
        id, e2eDecrypt, jwt,
      }));
    } catch (error) {
      errorMessage = getErrorMessage(error);
    }

    if (errorMessage) {
      throw new Error(errorMessage);
    } else if (fetchedPost) {
      cachePost(fetchedPost);
    }
  }, [id, currentUser]);

  return { cachePost, post, refreshPost };
}
