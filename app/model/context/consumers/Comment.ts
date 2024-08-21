import { useCallback } from 'react';
import { useCommentContext } from '../providers';
import useCurrentUser from './CurrentUser';
import { Comment, createComment as create } from '../../../networking';
import getErrorMessage from '../../ErrorMessage';

type CreateProps = {
  body: string;
  commentId?: string;
  postId: string;
};

export default function useComment() {
  const { cacheComment, getCachedComment } = useCommentContext();
  const { currentUser } = useCurrentUser();

  const createComment = useCallback(async ({
    body, commentId, postId,
  }: CreateProps) => {
    if (!currentUser) { throw new Error('Expected currentUser'); }

    let errorMessage: string | undefined;
    let newCommentId: string | undefined;
    try {
      const jwt = await currentUser.createAuthToken({ scope: '*' });
      const { e2eEncrypt } = currentUser;
      ({ commentId: newCommentId, errorMessage } = await create({
        body, commentId, e2eEncrypt, jwt, postId,
      }));
    } catch (error) {
      errorMessage = getErrorMessage(error);
    }

    if (errorMessage !== undefined) {
      throw new Error(errorMessage);
    } else {
      const parentComment = getCachedComment(commentId);
      const comment: Comment = {
        blockedAt: null,
        body,
        createdAt: new Date(),
        depth: parentComment ? (parentComment.depth + 1) : 0,
        id: newCommentId!,
        myVote: 1,
        postId,
        pseudonym: currentUser.pseudonym,
        score: 1,
        userId: currentUser.id,
      };
      cacheComment(comment);
      return comment;
    }
  }, [currentUser]);

  return { createComment };
}
