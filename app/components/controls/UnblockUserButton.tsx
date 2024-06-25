import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import SecondaryButton from './SecondaryButton';
import {
  ConfirmationAlert, GENERIC_ERROR_MESSAGE, ModerationEvent, useCurrentUser,
} from '../../model';
import { createModerationEvent } from '../../networking';
import { useRequestProgress } from '../hooks';

type Props = {
  moderationEvent: ModerationEvent;
  onUserUnblocked: () => void;
};

export default function UnblockUserButton({
  moderationEvent, onUserUnblocked,
}: Props) {
  const { loading, RequestProgress, setLoading } = useRequestProgress({
    removeWhenInactive: true,
  });

  const { currentUser } = useCurrentUser();

  const onPress = useCallback(async () => {
    const {
      id: moderatableId, pseudonym,
    } = moderationEvent.moderatable.creator;
    ConfirmationAlert({
      destructiveAction: 'Unblock',
      destructiveActionInTitle: `unblock ${pseudonym}`,
      onConfirm: async () => {
        if (!currentUser || !moderationEvent.id) { return; }

        setLoading(true);

        const jwt = await currentUser.createAuthToken({ scope: '*' });
        let errorMessage: string | undefined;
        try {
          ({ errorMessage } = await createModerationEvent({
            action: 'undo_block',
            jwt,
            moderatableId,
            moderatableType: 'User',
          }));
        } catch (error) {
          errorMessage = GENERIC_ERROR_MESSAGE;
        }

        setLoading(false);

        if (errorMessage) {
          Alert.alert('Failed to unblock. Please try again', errorMessage);
        } else {
          onUserUnblocked();
        }
      },
      subtitle: 'Unblocking will also remove the row from this list',
    }).show();
  }, [currentUser, moderationEvent, onUserUnblocked]);

  return (
    <>
      <RequestProgress />
      {!loading && (
        <SecondaryButton
          iconName="restart-alt"
          label="Unblock"
          onPress={onPress}
        />
      )}
    </>
  );
}
