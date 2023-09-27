import { useEffect, useState } from 'react';
import {
  Comment, CommentWithoutDepth, isCurrentUserData, isDefined,
} from './types';
import { useUserContext } from './UserContext';
import { fetchComments } from '../networking';
import { useCommentContext } from './CommentContext';

const getCommentIdsFrom = (comments?: Comment[]) => (comments ?? []).map((c) => c.id);

function getCommentsWithDepths(
  depth: number,
  commentsWithoutDepths: CommentWithoutDepth[],
): Comment[] {
  const comments: Comment[] = [];
  commentsWithoutDepths.forEach((commentWithoutDepth) => {
    comments.push({ ...commentWithoutDepth, depth });

    const repliesWithoutDepths = commentWithoutDepth.replies;
    const replies = getCommentsWithDepths(depth + 1, repliesWithoutDepths);
    comments.push(...replies);
  });
  return comments;
}

export default function useComments(postId?: string) {
  const { cacheComment, cacheComments, getCachedComment } = useCommentContext();
  const [commentIds, setCommentIds] = useState<string[]>([]);
  const comments = commentIds.map(getCachedComment).filter(isDefined);
  const [ready, setReady] = useState<boolean>(false);

  const { currentUser } = useUserContext();

  async function updateComments() {
    if (!isCurrentUserData(currentUser) || !postId) { return; }

    setReady(false);

    const jwt = await currentUser.createAuthToken({ scope: '*' });
    const {
      errorMessage, comments: commentsWithoutDepths,
    } = await fetchComments({ jwt, postId });

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    }

    const commentsWithDepths = getCommentsWithDepths(0, commentsWithoutDepths);
    cacheComments(commentsWithDepths);
    setCommentIds(getCommentIdsFrom(commentsWithDepths));
    setReady(true);
  }

  useEffect(() => {
    updateComments().catch(console.error);
  }, [postId]);

  return {
    cacheComment, comments, getCachedComment, ready, updateComments,
  };
}
