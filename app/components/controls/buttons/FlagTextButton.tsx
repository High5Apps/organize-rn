import React, { useCallback, useState } from 'react';
import { useFlag } from '../../../model';
import TextButton from './TextButton';

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

  const { confirmThenCreateFlag } = useFlag({ commentId, onSuccess });

  return (
    <TextButton disabled={disabled} onPress={confirmThenCreateFlag}>
      {label}
    </TextButton>
  );
}

FlagTextButton.defaultProps = {
  commentId: undefined,
  disabled: undefined,
};
