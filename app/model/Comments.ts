import { useEffect, useMemo, useState } from 'react';
import { Comment, isCurrentUserData, isDefined } from './types';
import { useUserContext } from './UserContext';
import { fetchComments } from '../networking';
import { useCommentContext } from './CommentContext';

export const MAX_COMMENT_DEPTH = 8;
export const MAX_COMMENT_LENGTH = 10000;

const getCommentIdsFrom = (comments?: Comment[]) => (comments ?? []).map((c) => c.id);

function getUnnestedComments(nestedComments: Comment[]): Comment[] {
  const unnestedComments: Comment[] = [];
  nestedComments.forEach((nestedComment) => {
    unnestedComments.push(nestedComment);

    const replies = getUnnestedComments(nestedComment.replies);
    unnestedComments.push(...replies);
  });
  return unnestedComments;
}

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
    if (!isCurrentUserData(currentUser) || !postId) { return; }

    setReady(false);

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const {
      errorMessage, comments: nestedComments,
    } = await fetchComments({ jwt, postId });

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    const unnestedComments = getUnnestedComments(nestedComments);
    cacheComments(unnestedComments);
    setCommentIds(getCommentIdsFrom(unnestedComments));
    setReady(true);
  }

  useEffect(() => {
    updateComments().catch(console.error);
  }, [postId]);

  return {
    cacheComment, comments, getCachedComment, ready, updateComments,
  };
}
