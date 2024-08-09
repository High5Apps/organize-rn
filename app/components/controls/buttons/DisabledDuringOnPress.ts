import { useCallback, useState } from 'react';

type Props = {
  onPress?: (() => Promise<void>) | (() => void);
};

export default function useDisabledDuringOnPress({ onPress }: Props) {
  const [disabled, setDisabled] = useState(false);

  const onPressWrapper = useCallback(async () => {
    if (!onPress) { return; }

    setDisabled(true);
    try {
      await onPress();
    } finally {
      setDisabled(false);
    }
  }, [onPress]);

  return { disabled, onPressWrapper };
}
