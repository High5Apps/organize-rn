import React, { useCallback, useState } from 'react';
import TextButton from './TextButton';
import { FlagConfirmationAlert } from '../modals';

type Props = {
  commentId?: string;
  disabled?: boolean;
};

export default function FlagTextButton({
  commentId, disabled: maybeDisabled,
}: Props) {
  const [label, setLabel] = useState<'Flag' | 'Flag ✓'>('Flag');
  const [temporarilyDisabled, setTemporarilyDisabled] = useState(false);
  const disabled = !!maybeDisabled || temporarilyDisabled;

  const onSuccess = useCallback(() => {
    setLabel('Flag ✓');
    setTemporarilyDisabled(true);

    setTimeout(() => {
      setLabel('Flag');
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
