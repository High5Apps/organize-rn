import { useCallback } from 'react';
import { Alert } from 'react-native';
import ConfirmationAlert from './ConfirmationAlert';
import useCurrentUser from './CurrentUser';
import { createFlag } from '../networking';
import { getErrorMessage } from './Errors';
import { FlaggableType } from './types';

type Props = {
  ballotId?: string;
  commentId?: string;
  onSuccess?: () => void;
  postId?: string;
};

export default function useFlag({
  ballotId, commentId, onSuccess, postId,
}: Props) {
  const { currentUser } = useCurrentUser();

  const confirmThenCreateFlag = useCallback(() => {
    let itemName = 'content';
    if (ballotId !== undefined) {
      itemName = 'ballot';
    } else if (commentId !== undefined) {
      itemName = 'comment';
    } else if (postId !== undefined) {
      itemName = 'discussion';
    }

    ConfirmationAlert({
      destructiveAction: 'Flag',
      onConfirm: async () => {
        if (!currentUser) { throw new Error('Expected current user'); }
        const { createAuthToken } = currentUser;

        const jwt = await createAuthToken({ scope: '*' });

        let errorMessage: string | undefined;
        try {
          ({ errorMessage } = await createFlag({
            ballotId, commentId, jwt, postId,
          }));
        } catch (error) {
          errorMessage = getErrorMessage(error);
        }

        if (errorMessage) {
          Alert.alert(
            `Failed to flag ${itemName}`,
            errorMessage,
          );
        } else {
          onSuccess?.();
        }
      },
      title: `Flag this ${itemName} as inappropriate?`,
    }).show();
  }, [ballotId, commentId, currentUser, onSuccess, postId]);

  return { confirmThenCreateFlag };
}

const flaggableTypeIconMap: { [key in FlaggableType]: string } = {
  Ballot: 'check-box',
  Comment: 'forum',
  Post: 'chat-bubble',
};

export const getFlagIcon = (category: FlaggableType) => (
  flaggableTypeIconMap[category] ?? 'article'
);
