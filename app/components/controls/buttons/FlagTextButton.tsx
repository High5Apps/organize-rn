import React, { useCallback, useState } from 'react';
import TextButton from './TextButton';
import FlagConfirmationAlert from '../modals/FlagConfirmationAlert';
import { useTranslation } from '../../../i18n';

type Props = {
  commentId?: string;
  disabled?: boolean;
};

export default function FlagTextButton({
  commentId, disabled: maybeDisabled,
}: Props) {
  const { t } = useTranslation();
  const [label, setLabel] = useState(t('action.flag'));
  const [temporarilyDisabled, setTemporarilyDisabled] = useState(false);
  const disabled = !!maybeDisabled || temporarilyDisabled;

  const onSuccess = useCallback(() => {
    setLabel(t('result.success.checked', { value: t('action.flag') }));
    setTemporarilyDisabled(true);

    setTimeout(() => {
      setLabel(t('action.flag'));
      setTemporarilyDisabled(false);
    }, 4000);
  }, []);

  return (
    <TextButton
      disabled={disabled}
      onPress={FlagConfirmationAlert({ commentId, onSuccess }).show}
    >
      {label}
    </TextButton>
  );
}
