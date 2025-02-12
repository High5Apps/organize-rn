import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import SecondaryButton from './SecondaryButton';
import {
  getErrorMessage, ModerationEvent, useModerationEvent,
} from '../../../model';
import { useRequestProgress } from '../../views';
import ConfirmationAlert from '../modals/ConfirmationAlert';

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

  const { createModerationEvent } = useModerationEvent();

  const onPress = useCallback(async () => {
    const { moderatable } = moderationEvent;

    ConfirmationAlert({
      destructiveAction: 'Unblock',
      destructiveActionInTitle: `unblock ${moderatable.creator.pseudonym}`,
      onConfirm: async () => {
        setLoading(true);

        try {
          await createModerationEvent({ action: 'undo_block', moderatable });
          onUserUnblocked();
        } catch (error) {
          const errorMessage = getErrorMessage(error);
          Alert.alert('Failed to unblock. Please try again', errorMessage);
        }

        setLoading(false);
      },
      subtitle: 'Unblocking will also remove the row from this list',
    }).show();
  }, [moderationEvent, onUserUnblocked]);

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
