import { useCallback } from 'react';
import { Alert } from 'react-native';
import ConfirmationAlert from './ConfirmationAlert';
import useCurrentUser from './CurrentUser';
import { createFlaggedItem } from '../networking';
import { GENERIC_ERROR_MESSAGE } from './Errors';

type Props = {
  ballotId?: string;
  commentId?: string;
  onSuccess?: () => void;
  postId?: string;
};

export default function useFlaggedItem({
  ballotId, commentId, onSuccess, postId,
}: Props) {
  const { currentUser } = useCurrentUser();

  const confirmThenCreateFlaggedItem = useCallback(() => {
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
          ({ errorMessage } = await createFlaggedItem({
            ballotId, commentId, jwt, postId,
          }));
        } catch (error) {
          if (error instanceof Error) {
            errorMessage = error.message;
          } else {
            errorMessage = GENERIC_ERROR_MESSAGE;
          }
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

  return { confirmThenCreateFlaggedItem };
}
