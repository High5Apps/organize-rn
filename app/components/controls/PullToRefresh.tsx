import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { RefreshControl as RNRefreshControl, StyleSheet } from 'react-native';
import useTheme from '../../Theme';
import useRequestProgress from './RequestProgress';
import { GENERIC_ERROR_MESSAGE } from '../../model';

const useStyles = () => {
  const { colors, spacing } = useTheme();

  const styles = StyleSheet.create({
    requestProgress: {
      margin: spacing.m,
    },
  });

  return { colors, styles };
};

type Props = {
  onRefresh: () => Promise<any>;
  refreshOnMount?: boolean;
};

export default function usePullToRefresh({ onRefresh, refreshOnMount }: Props) {
  const [refreshing, setRefreshing] = useState(false);

  const { colors, styles } = useStyles();
  const { RequestProgress, setResult } = useRequestProgress();

  const wrappedOnRefresh = useCallback(async () => {
    setResult('none');
    setRefreshing(true);

    try {
      await onRefresh();
    } catch (error) {
      console.error(error);
      setResult('error', { message: GENERIC_ERROR_MESSAGE });
    }

    setRefreshing(false);
  }, [onRefresh]);

  useEffect(() => {
    if (refreshOnMount) {
      // HACK: This timeout fixes an internal issue in RefreshControl.
      // The issue is iOS-only, and only happens when refreshing is true very
      // soon after mount.
      // https://github.com/facebook/react-native/issues/35779
      setTimeout(() => {
        wrappedOnRefresh().catch(console.error);
      }, 100);
    }
  }, []);

  const refreshControl = useMemo(() => (
    <RNRefreshControl
      colors={[colors.primary]}
      onRefresh={wrappedOnRefresh}
      progressBackgroundColor={colors.fill}
      refreshing={refreshing}
      tintColor={colors.primary}
    />
  ), [onRefresh]);

  const ListHeaderComponent = useCallback(
    () => <RequestProgress style={styles.requestProgress} />,
    [RequestProgress],
  );

  return { ListHeaderComponent, refreshControl, refreshing };
}
