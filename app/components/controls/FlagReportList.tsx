import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { FlagReport, useFlagReports } from '../../model';
import { ItemSeparator, ListEmptyMessage } from '../views';
import { useInfiniteScroll, usePullToRefresh } from '../hooks';
import FlagReportRow from './FlagReportRow';

const LIST_EMPTY_MESSAGE = "Good news- Org members haven't flagged anything as **inappropriate** yet!\n\nAll flagged content will appear here, so that **moderators can decide** if it should be **blocked or allowed**.\n\nHowever, Org members can still choose to see blocked content in the **Transparency Log**.";

type Props = {
  onItemPress?: (item: FlagReport) => void;
};

export default function FlagReportList({ onItemPress }: Props) {
  const {
    fetchedLastPage, fetchFirstPageOfFlagReports, fetchNextPageOfFlagReports,
    flagReports, ready,
  } = useFlagReports({ sort: 'top' });

  const { ListHeaderComponent, refreshControl, refreshing } = usePullToRefresh({
    onRefresh: async () => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      clearNextPageError();

      await fetchFirstPageOfFlagReports();
    },
    refreshOnMount: true,
  });

  const {
    clearError: clearNextPageError,
    ListFooterComponent,
    onEndReached,
    onEndReachedThreshold,
  } = useInfiniteScroll({
    getDisabled: () => (!flagReports.length || refreshing || fetchedLastPage),
    onLoadNextPage: fetchNextPageOfFlagReports,
  });

  const ListEmptyComponent = useCallback(() => (
    <ListEmptyMessage asteriskDelimitedMessage={LIST_EMPTY_MESSAGE} />
  ), []);

  const renderItem: ListRenderItem<FlagReport> = useCallback(
    ({ item }) => <FlagReportRow item={item} onPress={onItemPress} />,
    [onItemPress],
  );

  return (
    <FlatList
      data={flagReports}
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

FlagReportList.defaultProps = {
  onItemPress: undefined,
};
