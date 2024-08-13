import { useState } from 'react';
import { useCommentContext } from './context';
import useModels, { getIdsFrom } from './Models';
import useCurrentUser from './CurrentUser';
import { Comment } from './types';
import { fetchCommentThread } from '../networking';

export default function useCommentThread(commentId: string) {
  const { cacheComment, cacheComments, getCachedComment } = useCommentContext();
  const {
    models: comments, setIds: setCommentIds,
  } = useModels<Comment>({ getCachedModel: getCachedComment });
  const [ready, setReady] = useState<boolean>(false);

  const { currentUser } = useCurrentUser();

  async function fetchThread() {
    if (!currentUser) { return; }

    setReady(false);

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const { e2eDecryptMany } = currentUser;
    const {
      errorMessage, comments: fetchedComments,
    } = await fetchCommentThread({ commentId, e2eDecryptMany, jwt });

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    cacheComments(fetchedComments);
    setCommentIds(getIdsFrom(fetchedComments));
    setReady(true);
  }

  return {
    cacheComment, comments, fetchThread, ready,
  };
}
