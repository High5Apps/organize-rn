import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { Flag, useFlags } from '../../model';
import { ItemSeparator, ListEmptyMessage } from '../views';
import { useInfiniteScroll, usePullToRefresh } from '../hooks';
import FlagRow from './FlagRow';

const LIST_EMPTY_MESSAGE = "Good news- Org members haven't flagged anything as **inappropriate** yet!\n\nAll flagged content will appear here, so that **moderators can decide** if it should be **blocked or allowed**.\n\nHowever, Org members can still choose to see blocked content in the **Transparency Log**.";

type Props = {
  onItemPress?: (item: Flag) => void;
};

export default function FlagList({ onItemPress }: Props) {
  const {
    fetchedLastPage, fetchFirstPageOfFlags, fetchNextPageOfFlags, flags, ready,
  } = useFlags({ sort: 'top' });

  const { ListHeaderComponent, refreshControl, refreshing } = usePullToRefresh({
    onRefresh: async () => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      clearNextPageError();

      await fetchFirstPageOfFlags();
    },
    refreshOnMount: true,
  });

  const {
    clearError: clearNextPageError,
    ListFooterComponent,
    onEndReached,
    onEndReachedThreshold,
  } = useInfiniteScroll({
    getDisabled: () => (!flags.length || refreshing || fetchedLastPage),
    onLoadNextPage: fetchNextPageOfFlags,
  });

  const ListEmptyComponent = useCallback(() => (
    <ListEmptyMessage asteriskDelimitedMessage={LIST_EMPTY_MESSAGE} />
  ), []);

  const renderItem: ListRenderItem<Flag> = useCallback(
    ({ item }) => <FlagRow item={item} onPress={onItemPress} />,
    [onItemPress],
  );

  return (
    <FlatList
      data={flags}
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

FlagList.defaultProps = {
  onItemPress: undefined,
};
