import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { FlaggedItem, useFlaggedItems } from '../../model';
import { ItemSeparator, ListEmptyMessage } from '../views';
import { useInfiniteScroll, usePullToRefresh } from '../hooks';
import FlaggedItemRow from './FlaggedItemRow';

const LIST_EMPTY_MESSAGE = "Good news- Org members haven't flagged anything as **inappropriate** yet!\n\nAll flagged content will appear here, so that **moderators can decide** if it should be **blocked or allowed**.\n\nHowever, Org members can still choose to see blocked content in the **Transparency Log**.";

type Props = {
  onItemPress?: (item: FlaggedItem) => void;
};

export default function FlaggedItemList({ onItemPress }: Props) {
  const {
    fetchedLastPage, fetchFirstPageOfFlaggedItems, fetchNextPageOfFlaggedItems,
    flaggedItems, ready,
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

  const ListEmptyComponent = useCallback(() => (
    <ListEmptyMessage asteriskDelimitedMessage={LIST_EMPTY_MESSAGE} />
  ), []);

  const renderItem: ListRenderItem<FlaggedItem> = useCallback(
    ({ item }) => <FlaggedItemRow item={item} onPress={onItemPress} />,
    [onItemPress],
  );

  return (
    <FlatList
      data={flaggedItems}
      ItemSeparatorComponent={ItemSeparator}
      ListEmptyComponent={ready ? ListEmptyComponent : null}
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
