import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { RefreshControl as RNRefreshControl } from 'react-native';
import useTheme from '../../Theme';

type Props = {
  onRefresh: () => Promise<void>;
  refreshOnMount?: boolean;
};

export default function usePullToRefresh({ onRefresh, refreshOnMount }: Props) {
  const [refreshing, setRefreshing] = useState(false);

  const { colors } = useTheme();

  const wrappedOnRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await onRefresh();
    } catch (error) {
      console.error(error);
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
      refreshing={refreshing}
      tintColor={colors.primary}
    />
  ), [onRefresh]);

  return { refreshControl, refreshing };
}
