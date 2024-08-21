import { useCallback, useState } from 'react';
import { VoteState } from './types';
import { useCurrentUser } from './context';
import { createOrUpdateUpvote } from '../networking';
import getErrorMessage from './ErrorMessage';

type Props = {
  commentId?: string;
  postId?: string;
};

export default function useUpvote({ commentId, postId }: Props) {
  const [
    waitingForVoteSate, setWaitingForVoteSate,
  ] = useState<VoteState | null>(null);
  const { currentUser } = useCurrentUser();

  const createUpvote = useCallback(async ({ vote }: { vote: VoteState }) => {
    if (!currentUser) { return; }

    setWaitingForVoteSate(vote);

    const jwt = await currentUser.createAuthToken({ scope: '*' });

    let errorMessage;
    try {
      ({ errorMessage } = await createOrUpdateUpvote({
        commentId, jwt, postId, value: vote,
      }));
    } catch (error) {
      errorMessage = getErrorMessage(error);
    }

    setWaitingForVoteSate(null);

    if (errorMessage) {
      throw new Error(errorMessage);
    }
  }, [commentId, currentUser, postId]);

  return { createUpvote, waitingForVoteSate };
}
