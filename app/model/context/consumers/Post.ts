import { useCallback, useMemo } from 'react';
import { usePostContext } from '../providers';
import useCurrentUser from './CurrentUser';
import { Post } from '../../types';
import {
  createPost as create, fetchPost, PostCategory,
} from '../../../networking';
import getErrorMessage from '../../ErrorMessage';

type Props = {
  id?: string;
};

type CreateProps = {
  body?: string;
  candidateId?: string | null;
  category: PostCategory;
  title: string;
};

export default function usePost({ id: maybeId }: Props = {}) {
  const { cachePost, getCachedPost } = usePostContext();

  const post = useMemo(
    () => getCachedPost(maybeId),
    [maybeId, getCachedPost],
  );

  const { currentUser } = useCurrentUser();

  const createPost = useCallback(async ({
    body, candidateId, category, title,
  }: CreateProps) => {
    if (!currentUser) { throw new Error('Expected current user'); }

    let errorMessage: string | undefined;
    let createdAt: Date | undefined;
    let id: string | undefined;
    try {
      const jwt = await currentUser.createAuthToken({ scope: '*' });
      const { e2eEncrypt } = currentUser;

      ({ errorMessage, createdAt, id } = await create({
        body, candidateId, category, e2eEncrypt, jwt, title,
      }));
    } catch (error) {
      errorMessage = getErrorMessage(error);
    }

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    } else {
      const createdPost: Post = {
        body,
        candidateId,
        createdAt: createdAt!,
        category,
        deletedAt: null,
        id: id!,
        myVote: 1,
        pseudonym: currentUser.pseudonym,
        score: 1,
        title,
        userId: currentUser.id,
      };
      cachePost(createdPost);
      return createdPost;
    }
  }, [currentUser]);

  const refreshPost = useCallback(async () => {
    if (!currentUser) { throw new Error('Expected current user'); }
    if (!maybeId) { throw new Error('Expected post id'); }
    const { createAuthToken, e2eDecrypt } = currentUser;

    const jwt = await createAuthToken({ scope: '*' });

    let errorMessage: string | undefined;
    let fetchedPost: Post | undefined;
    try {
      ({ post: fetchedPost, errorMessage } = await fetchPost({
        id: maybeId, e2eDecrypt, jwt,
      }));
    } catch (error) {
      errorMessage = getErrorMessage(error);
    }

    if (errorMessage) {
      throw new Error(errorMessage);
    } else if (fetchedPost) {
      cachePost(fetchedPost);
    }
  }, [maybeId, currentUser]);

  return {
    cachePost, createPost, post, refreshPost,
  };
}
