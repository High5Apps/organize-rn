import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import SecondaryButton from './SecondaryButton';
import {
  getErrorMessage, ModerationEvent, useModerationEvent,
} from '../../../model';
import { useRequestProgress } from '../../views';
import ConfirmationAlert from '../modals/ConfirmationAlert';
import { useTranslation } from '../../../i18n';

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

  const { t } = useTranslation();

  const onPress = useCallback(async () => {
    const { moderatable } = moderationEvent;

    ConfirmationAlert({
      destructiveAction: t('action.unblock'),
      destructiveActionInTitle: `unblock ${moderatable.creator.pseudonym}`,
      onConfirm: async () => {
        setLoading(true);

        try {
          await createModerationEvent({ action: 'undo_block', moderatable });
          onUserUnblocked();
        } catch (error) {
          const errorMessage = getErrorMessage(error);
          Alert.alert(t('result.error.unblock'), errorMessage);
        }

        setLoading(false);
      },
      subtitle: t('hint.unblockRemovesRow'),
    }).show();
  }, [moderationEvent, onUserUnblocked, t]);

  return (
    <>
      <RequestProgress />
      {!loading && (
        <SecondaryButton
          iconName="restart-alt"
          label={t('action.unblock')}
          onPress={onPress}
        />
      )}
    </>
  );
}
