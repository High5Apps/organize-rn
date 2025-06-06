import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { ModerationEvent, useModerationEvents } from '../../../model';
import { ItemSeparator, ListEmptyMessage } from '../../views';
import { TransparencyLogRow } from './rows';
import usePullToRefresh from './PullToRefresh';
import useInfiniteScroll from './InfiniteScroll';
import { useTranslation } from '../../../i18n';

type Props = {
  onItemPress: (item: ModerationEvent) => void;
};

export default function TransparencyLogList({ onItemPress }: Props) {
  const {
    fetchedLastPage, fetchFirstPageOfModerationEvents,
    fetchNextPageOfModerationEvents, moderationEvents, ready,
    removeModerationEvent,
  } = useModerationEvents({ actions: ['block', 'undo_block'] });

  const { ListHeaderComponent, refreshControl, refreshing } = usePullToRefresh({
    onRefresh: async () => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      clearNextPageError();

      await fetchFirstPageOfModerationEvents();
    },
    refreshOnMount: true,
  });

  const {
    clearError: clearNextPageError, ListFooterComponent, onEndReached,
    onEndReachedThreshold,
  } = useInfiniteScroll({
    getDisabled: () => (
      !moderationEvents.length || refreshing || fetchedLastPage
    ),
    onLoadNextPage: fetchNextPageOfModerationEvents,
  });

  const { t } = useTranslation();
  const ListEmptyComponent = useMemo(() => (
    <ListEmptyMessage
      asteriskDelimitedMessage={t('hint.emptyTransparencyLog')}
    />
  ), [t]);

  const renderItem: ListRenderItem<ModerationEvent> = useCallback(
    ({ item }) => <TransparencyLogRow item={item} onPress={onItemPress} />,
    [onItemPress, removeModerationEvent],
  );

  return (
    <FlatList
      data={moderationEvents}
      ItemSeparatorComponent={ItemSeparator}
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={ready ? ListEmptyComponent : null}
      ListFooterComponent={ListFooterComponent}
      ListHeaderComponent={ListHeaderComponent}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      refreshControl={refreshControl}
      refreshing={refreshing}
      renderItem={renderItem}
    />
  );
}
