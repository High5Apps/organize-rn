import React, { useCallback, useState } from 'react';
import { useFlag } from '../../model';
import TextButton from './TextButton';

type Props = {
  commentId?: string;
};

export default function FlagTextButton({ commentId }: Props) {
  const [label, setLabel] = useState<'Flag' | 'Flag ✓'>('Flag');
  const [disabled, setDisabled] = useState(false);

  const onSuccess = useCallback(() => {
    setLabel('Flag ✓');
    setDisabled(true);

    setTimeout(() => {
      setLabel('Flag');
      setDisabled(false);
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
};