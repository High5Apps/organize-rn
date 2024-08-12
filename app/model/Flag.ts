import { useCallback } from 'react';
import useCurrentUser from './CurrentUser';
import { createFlag } from '../networking';
import getErrorMessage from './ErrorMessage';

type Props = {
  ballotId?: string;
  commentId?: string;
  postId?: string;
};

export default function useFlag({ ballotId, commentId, postId }: Props) {
  const { currentUser } = useCurrentUser();

  const wrappedCreateFlag = useCallback(async () => {
    if (!currentUser) { throw new Error('Expected current user'); }

    const jwt = await currentUser.createAuthToken({ scope: '*' });

    let errorMessage: string | undefined;
    try {
      ({ errorMessage } = await createFlag({
        ballotId, commentId, jwt, postId,
      }));
    } catch (error) {
      errorMessage = getErrorMessage(error);
    }

    if (errorMessage) {
      throw new Error(errorMessage);
    }
  }, [ballotId, commentId, currentUser, postId]);

  return { createFlag: wrappedCreateFlag };
}
