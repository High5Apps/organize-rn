import { useCallback, useState } from 'react';
import { TextInputProps } from 'react-native';

type Props = {
  orderedInputNames: string[];
};

export default function useFocusedInput({ orderedInputNames }: Props) {
  if (orderedInputNames.length === 0) {
    throw new Error('Expected orderedInputNames not to be empty');
  }

  const lastInput = orderedInputNames.at(-1)!;

  const [focusedInput, setFocusedInput] = useState<string>();

  function enterKeyHint(inputName: string): TextInputProps['enterKeyHint'] {
    return (inputName === lastInput) ? 'done' : 'next';
  }

  const focused = (inputName: string) => (focusedInput === inputName);

  const onFocus = (inputName: string) => () => setFocusedInput(inputName);

  const onSubmitEditing = useCallback((inputName: string) => (() => {
    const index = orderedInputNames.indexOf(inputName);
    const nextInput = orderedInputNames.at(1 + index);
    setFocusedInput(nextInput);
  }), []);

  function submitBehavior(inputName: string): TextInputProps['submitBehavior'] {
    return (inputName === lastInput) ? 'blurAndSubmit' : 'submit';
  }

  return {
    enterKeyHint, focused, onFocus, onSubmitEditing, submitBehavior,
  };
}
