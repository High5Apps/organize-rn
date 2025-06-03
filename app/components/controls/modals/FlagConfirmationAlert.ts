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
    let errorTitle: string;
    let title: string;
    if (ballotId !== undefined) {
      errorTitle = t('result.error.flag.ballot');
      title = t('question.confirmation.flag.ballot');
    } else if (commentId !== undefined) {
      errorTitle = t('result.error.flag.comment');
      title = t('question.confirmation.flag.comment');
    } else if (postId !== undefined) {
      errorTitle = t('result.error.flag.discussion');
      title = t('question.confirmation.flag.discussion');
    } else {
      errorTitle = t('result.error.flag.content');
      title = t('question.confirmation.flag.content');
    }

    ConfirmationAlert({
      destructiveAction: t('action.flag'),
      onConfirm: async () => {
        try {
          await createFlag();
          onSuccess?.();
        } catch (error) {
          const errorMessage = getErrorMessage(error);
          Alert.alert(errorTitle, errorMessage);
        }
      },
      title,
    }).show();
  }, [createFlag, t]);

  return { show };
}
