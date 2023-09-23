import { useEffect, useState } from 'react';
import { Comment, CommentWithoutDepth, isCurrentUserData } from './types';
import { useUserContext } from './UserContext';
import { fetchComments } from '../networking';

const commentToEntry = (comment: Comment) => [comment.id, comment] as const;
const commentsToMap = (comments: Comment[]) => new Map(comments.map(commentToEntry));

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
  const [
    commentCache, setCommentCache,
  ] = useState<Map<string, Comment>>(new Map());
  const comments = [...commentCache.values()];
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
    setCommentCache(commentsToMap(commentsWithDepths));
    setReady(true);
  }

  useEffect(() => {
    updateComments().catch(console.error);
  }, [postId]);

  function onCommentChanged(comment: Comment) {
    const index = comments.findIndex((c) => c.id === comment.id);
    if (index < 0) { return; }

    const cachedComment = commentCache.get(comment.id);
    if (cachedComment === undefined) {
      console.warn("Attempted to update a comment that wasn't in the cache");
      return;
    }

    setCommentCache((cc) => {
      const cachedComments = [...cc.values()];
      return commentsToMap([...cachedComments, comment]);
    });
  }

  return {
    comments, onCommentChanged, ready, updateComments,
  };
}
