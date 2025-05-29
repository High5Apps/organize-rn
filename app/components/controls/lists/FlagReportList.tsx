import React, { useCallback, useRef } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { FlagReport, useCurrentUser, useFlagReports } from '../../../model';
import { ItemSeparator, ListEmptyMessage } from '../../views';
import { FlagReportRow } from './rows';
import usePullToRefresh from './PullToRefresh';
import useInfiniteScroll from './InfiniteScroll';
import { useTranslation } from '../../../i18n';

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

  const { t } = useTranslation();
  const listEmptyMessage = t(handled
    ? 'hint.emptyHandledFlaggedContent' : 'hint.emptyPendingFlaggedContent');
  const ListEmptyComponent = useCallback(() => (
    <ListEmptyMessage asteriskDelimitedMessage={listEmptyMessage} />
  ), [listEmptyMessage]);

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

  const listRef = useRef<FlatList<FlagReport>>(null);
  useScrollToTop(listRef);

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
      ref={listRef}
      refreshControl={refreshControl}
      renderItem={renderItem}
    />
  );
}
