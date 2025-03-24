import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInputProps } from 'react-native';
import { useDebounce } from 'use-debounce';
import { TextInputRow } from './text';
import useTheme from '../../Theme';

const useStyles = () => {
  const { spacing } = useTheme();

  const styles = StyleSheet.create({
    textInputContainer: {
      paddingHorizontal: spacing.m,
    },
  });

  return { styles };
};

type Props = {
  disabled?: boolean;
  initialValue?: string;
  onDebouncedQueryChanged?: ((text: string) => void) | undefined;
} & Omit<TextInputProps, 'iconEndDisabled' | 'iconEndOnPress' | 'value'>;

export default function SearchBar({
  disabled = false, initialValue, onDebouncedQueryChanged = () => null,
  onChangeText, ...textInputProps
}: Props) {
  const [value, setValue] = useState<string | undefined>(initialValue);
  const wrappedSetValue = (text: string) => {
    setValue(text);
    onChangeText?.(text);
  };
  const [debouncedQuery] = useDebounce(value, 500);

  useEffect(() => {
    if (debouncedQuery !== undefined) {
      onDebouncedQueryChanged?.(debouncedQuery);
    }
  }, [debouncedQuery]);

  const { styles } = useStyles();
  return (
    <TextInputRow
      autoFocus={false}
      containerStyle={styles.textInputContainer}
      editable={!disabled}
      enterKeyHint="search"
      iconEndDisabled={((value?.length ?? 0) === 0) || disabled}
      iconEndName="close"
      iconEndOnPress={() => wrappedSetValue('')}
      onChangeText={wrappedSetValue}
      placeholder="Search"
      value={value}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...textInputProps}
    />
  );
}
