import { useState } from 'react';
import type { Comment } from './types';

const commentToEntry = (comment: Comment) => [comment.id, comment] as const;
const commentsToMap = (comments: Comment[]) => new Map(
  comments.map(commentToEntry),
);

export default function useCommentCache() {
  const [
    commentCache, setCommentCache,
  ] = useState<Map<string, Comment>>(new Map());

  function getCachedComment(commentId: string) {
    return commentCache.get(commentId);
  }

  function cacheComments(comments?: Comment[]) {
    if (comments === undefined) { return; }

    setCommentCache((cc) => {
      const cachedComments = [...cc.values()];
      return commentsToMap([...cachedComments, ...comments]);
    });
  }

  function cacheComment(comment: Comment) {
    cacheComments([comment]);
  }

  return { cacheComment, cacheComments, getCachedComment };
}
