import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useDebounce } from 'use-debounce';
import { TextInputRow } from './text';
import useTheme from '../../Theme';
import { useTranslation } from '../../i18n';

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
  onDebouncedQueryChanged?: ((text: string) => void) | undefined;
};

export default function SearchBar({
  disabled = false, onDebouncedQueryChanged = () => null,
}: Props) {
  const [value, setValue] = useState<string | undefined>();
  const [debouncedQuery] = useDebounce(value, 500);

  useEffect(() => {
    if (debouncedQuery !== undefined) {
      onDebouncedQueryChanged?.(debouncedQuery);
    }
  }, [debouncedQuery]);

  const { styles } = useStyles();
  const { t } = useTranslation();
  return (
    <TextInputRow
      containerStyle={styles.textInputContainer}
      editable={!disabled}
      iconEndDisabled={((value?.length ?? 0) === 0) || disabled}
      iconEndName="close"
      iconEndOnPress={() => setValue('')}
      onChangeText={setValue}
      placeholder={t('action.search')}
      returnKeyType="search"
      value={value}
    />
  );
}
