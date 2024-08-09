import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { FlagReport, useCurrentUser, useFlagReports } from '../../../model';
import { ItemSeparator, ListEmptyMessage } from '../../views';
import { FlagReportRow } from './rows';
import usePullToRefresh from './PullToRefresh';
import useInfiniteScroll from './InfiniteScroll';

const LIST_EMPTY_MESSAGE_PENDING = 'When **members flag content** as **inappropriate**, it shows up here.\n\n**You** and the other **mods decide** if it should be **blocked** or **allowed**.\n\nBlocked content is **hidden** from the **main feeds**, but members can still view it in the **Transparency Log**.';
const LIST_EMPTY_MESSAGE_HANDLED = 'When you or the other mods allow or block flagged content, it shows up here.';

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

  const listEmptyMessage = handled ? LIST_EMPTY_MESSAGE_HANDLED
    : LIST_EMPTY_MESSAGE_PENDING;
  const ListEmptyComponent = useCallback(() => (
    <ListEmptyMessage asteriskDelimitedMessage={listEmptyMessage} />
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
