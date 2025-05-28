import { useCallback } from 'react';
import { Alert } from 'react-native';
import ConfirmationAlert from './ConfirmationAlert';
import { getErrorMessage, useFlag } from '../../../model';
import { useTranslation } from '../../../i18n';

type Props = {
  ballotId?: string;
  commentId?: string;
  onSuccess?: () => void;
  postId?: string;
};

export default function FlagConfirmationAlert({
  ballotId, commentId, onSuccess, postId,
}: Props) {
  const { createFlag } = useFlag({ ballotId, commentId, postId });

  const { t } = useTranslation();

  const show = useCallback(() => {
    let itemName = 'content';
    if (ballotId !== undefined) {
      itemName = 'ballot';
    } else if (commentId !== undefined) {
      itemName = 'comment';
    } else if (postId !== undefined) {
      itemName = 'discussion';
    }

    ConfirmationAlert({
      destructiveAction: t('action.flag'),
      onConfirm: async () => {
        try {
          await createFlag();
          onSuccess?.();
        } catch (error) {
          const errorMessage = getErrorMessage(error);
          Alert.alert(`Failed to flag ${itemName}`, errorMessage);
        }
      },
      title: `Flag this ${itemName} as inappropriate?`,
    }).show();
  }, [createFlag]);

  return { show };
}
