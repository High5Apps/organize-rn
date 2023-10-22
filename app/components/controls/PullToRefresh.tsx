import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { RefreshControl as RNRefreshControl } from 'react-native';

type Props = {
  onRefresh: () => Promise<void>;
  refreshOnMount?: boolean;
};

export default function usePullToRefresh({ onRefresh, refreshOnMount }: Props) {
  const [refreshing, setRefreshing] = useState(false);

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
      wrappedOnRefresh().catch(console.error);
    }
  }, []);

  const refreshControl = useMemo(() => (
    <RNRefreshControl onRefresh={wrappedOnRefresh} refreshing={refreshing} />
  ), [onRefresh]);

  return { refreshControl, refreshing };
}
