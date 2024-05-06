import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { FlaggedItem, useFlaggedItems } from '../../model';
import { ItemSeparator } from '../views';
import { useInfiniteScroll, usePullToRefresh } from '../hooks';
import FlaggedItemRow from './FlaggedItemRow';

type Props = {
  onItemPress?: (item: FlaggedItem) => void;
};

export default function FlaggedItemList({ onItemPress }: Props) {
  const {
    fetchedLastPage, fetchFirstPageOfFlaggedItems, fetchNextPageOfFlaggedItems,
    flaggedItems,
  } = useFlaggedItems({ sort: 'top' });

  const { ListHeaderComponent, refreshControl, refreshing } = usePullToRefresh({
    onRefresh: async () => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      clearNextPageError();

      await fetchFirstPageOfFlaggedItems();
    },
    refreshOnMount: true,
  });

  const {
    clearError: clearNextPageError,
    ListFooterComponent,
    onEndReached,
    onEndReachedThreshold,
  } = useInfiniteScroll({
    getDisabled: () => (!flaggedItems.length || refreshing || fetchedLastPage),
    onLoadNextPage: fetchNextPageOfFlaggedItems,
  });

  const renderItem: ListRenderItem<FlaggedItem> = useCallback(
    ({ item }) => <FlaggedItemRow item={item} onPress={onItemPress} />,
    [onItemPress],
  );

  return (
    <FlatList
      data={flaggedItems}
      ItemSeparatorComponent={ItemSeparator}
      ListFooterComponent={ListFooterComponent}
      ListHeaderComponent={ListHeaderComponent}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      keyboardShouldPersistTaps="handled"
      refreshControl={refreshControl}
      renderItem={renderItem}
    />
  );
}

FlaggedItemList.defaultProps = {
  onItemPress: undefined,
};
