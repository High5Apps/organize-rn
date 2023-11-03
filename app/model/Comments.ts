import { useMemo, useState } from 'react';
import { Comment, isCurrentUserData, isDefined } from './types';
import { useUserContext } from './UserContext';
import { fetchComments } from '../networking';
import { useCommentContext } from './CommentContext';

export const MAX_COMMENT_DEPTH = 8;
export const MAX_COMMENT_LENGTH = 10000;

const getCommentIdsFrom = (comments?: Comment[]) => (comments ?? []).map((c) => c.id);

export default function useComments(postId?: string) {
  const { cacheComment, cacheComments, getCachedComment } = useCommentContext();
  const [commentIds, setCommentIds] = useState<string[]>([]);
  const comments = useMemo(
    () => commentIds.map(getCachedComment).filter(isDefined),
    [commentIds, getCachedComment],
  );
  const [ready, setReady] = useState<boolean>(false);

  const { currentUser } = useUserContext();

  async function updateComments() {
    if (!isCurrentUserData(currentUser) || !postId) {
      return { isEmpty: true };
    }

    setReady(false);

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { e2eDecryptMany } = currentUser;
    const {
      errorMessage, comments: fetchedComments,
    } = await fetchComments({ e2eDecryptMany, jwt, postId });

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    cacheComments(fetchedComments);
    setCommentIds(getCommentIdsFrom(fetchedComments));
    setReady(true);

    const isEmpty = (fetchedComments.length === 0);
    return { isEmpty };
  }

  return {
    cacheComment, comments, getCachedComment, ready, updateComments,
  };
}
