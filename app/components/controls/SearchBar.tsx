import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useDebounce } from 'use-debounce';
import TextInputRow from './TextInputRow';
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
  onDebouncedQueryChanged?: ((text: string) => void) | undefined;
};

export default function SearchBar({ onDebouncedQueryChanged }: Props) {
  const [value, setValue] = useState<string | undefined>();
  const [debouncedQuery] = useDebounce(value, 750);

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
      iconEndDisabled={(value?.length ?? 0) === 0}
      iconEndName="close"
      iconEndOnPress={() => setValue('')}
      onChangeText={setValue}
      placeholder="Search"
      returnKeyType="search"
      value={value}
    />
  );
}

SearchBar.defaultProps = {
  onDebouncedQueryChanged: () => null,
};
