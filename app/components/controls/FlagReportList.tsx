import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { FlagReport, useCurrentUser, useFlagReports } from '../../model';
import { ItemSeparator, ListEmptyMessage } from '../views';
import { useInfiniteScroll, usePullToRefresh } from '../hooks';
import FlagReportRow from './FlagReportRow';

const LIST_EMPTY_MESSAGE = "Good news- Org members haven't flagged anything as **inappropriate** yet!\n\nAll flagged content will appear here, so that **moderators can decide** if it should be **blocked or allowed**.\n\nHowever, Org members can still choose to see blocked content in the **Transparency Log**.";

type Props = {
  handled: boolean;
  onItemPress?: (item: FlagReport) => void;
};

export default function FlagReportList({ handled, onItemPress }: Props) {
  const { currentUser } = useCurrentUser();
  if (!currentUser) { throw new Error('Expected currentUser'); }

  const {
    fetchedLastPage, fetchFirstPageOfFlagReports, fetchNextPageOfFlagReports,
    flagReports, onFlagReportChanged, ready,
  } = useFlagReports({ handled });

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
    ({ item }) => (
      <FlagReportRow
        currentUserId={currentUser.id}
        currentUserPseudonym={currentUser.pseudonym}
        item={item}
        onFlagReportChanged={onFlagReportChanged}
        onPress={onItemPress}
      />
    ),
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
