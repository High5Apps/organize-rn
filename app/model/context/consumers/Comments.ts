import { useEffect, useState } from 'react';
import { Comment } from '../../types';
import useCurrentUser from './CurrentUser';
import { fetchComments } from '../../../networking';
import { useCommentContext } from '../providers';
import useModels, { getIdsFrom } from './Models';

export const BLOCKED_COMMENT_BODY = '[blocked]';
export const DELETED_COMMENT_BODY = '[left Org]';
export const MAX_COMMENT_DEPTH = 8;
export const MAX_COMMENT_LENGTH = 10000;

export default function useComments(postId?: string) {
  const { cacheComment, cacheComments, getCachedComment } = useCommentContext();
  const {
    models: comments, setIds: setCommentIds,
  } = useModels<Comment>({ getCachedModel: getCachedComment });
  const [ready, setReady] = useState<boolean>(false);

  const { currentUser } = useCurrentUser();

  useEffect(() => {
    setCommentIds([]);
    setReady(false);
  }, [postId]);

  async function refreshComments() {
    if (!currentUser || !postId) {
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
    setCommentIds(getIdsFrom(fetchedComments));
    setReady(true);

    const isEmpty = (fetchedComments.length === 0);
    return { isEmpty };
  }

  return {
    cacheComment, comments, getCachedComment, ready, refreshComments,
  };
}
