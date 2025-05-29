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
    let itemName = t('object.content');
    if (ballotId !== undefined) {
      itemName = t('object.ballot');
    } else if (commentId !== undefined) {
      itemName = t('object.comment');
    } else if (postId !== undefined) {
      itemName = t('object.discussion');
    }
    itemName = itemName.toLocaleLowerCase();

    ConfirmationAlert({
      destructiveAction: t('action.flag'),
      onConfirm: async () => {
        try {
          await createFlag();
          onSuccess?.();
        } catch (error) {
          const errorMessage = getErrorMessage(error);
          Alert.alert(t('result.error.flag', { itemName }), errorMessage);
        }
      },
      title: t('question.confirmation.flag', { itemName }),
    }).show();
  }, [createFlag, t]);

  return { show };
}
