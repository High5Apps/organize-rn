import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { useRequestProgress } from '../../views';
import useTheme from '../../../Theme';
import { useTranslation } from '../../../i18n';

// Fetch the next page when the user scrolls to within half the vertical list
// height of the bottom of the list
const onEndReachedThreshold = 0.5;

const useStyles = () => {
  const { spacing } = useTheme();

  const styles = StyleSheet.create({
    requestProgress: {
      margin: spacing.m,
    },
  });

  return { styles };
};

type Props = {
  getDisabled?: () => boolean;
  onLoadNextPage: () => Promise<{ hasNextPage: boolean }>;
};

export default function useInfiniteScroll({ getDisabled, onLoadNextPage }: Props) {
  const { styles } = useStyles();
  const { t } = useTranslation();

  const {
    loading, RequestProgress, result, setLoading, setResult,
  } = useRequestProgress();

  const onEndReached = useCallback(async () => {
    if (getDisabled?.() || result === 'error' || loading) { return; }

    setLoading(true);

    try {
      const { hasNextPage } = await onLoadNextPage();
      if (!hasNextPage) {
        setResult('info', { message: t('hint.listEnd') });
      }
    } catch (error) {
      setResult('error', { error });
    }

    setLoading(false);
  }, [onLoadNextPage]);

  const ListFooterComponent = useCallback(
    () => <RequestProgress style={styles.requestProgress} />,
    [RequestProgress],
  );

  const clearError = useCallback(() => setResult('none'), []);

  return {
    clearError, ListFooterComponent, onEndReached, onEndReachedThreshold,
  };
}
