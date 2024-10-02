import React, { useCallback, useMemo, useRef } from 'react';
import {
  FlatList, ListRenderItem, StyleProp, ViewStyle,
} from 'react-native';
import {
  ModerationEvent, useModerationEvents, usePrependedModels,
} from '../../../model';
import { BlockedMemberRow } from './rows';
import { ItemSeparator, ListEmptyMessage } from '../../views';
import useInfiniteScroll from './InfiniteScroll';
import usePullToRefresh from './PullToRefresh';

const LIST_EMPTY_MESSAGE = "Blocking members prevents them from accessing your Org.\n\nYou Org hasn't blocked any members.\n\nIf you need to block someone, tap the button below to get started.";

type Props = {
  contentContainerStyle?: StyleProp<ViewStyle>;
  prependedModerationEventId?: string;
};

export default function BlockedMemberList({
  contentContainerStyle,
  prependedModerationEventId: maybePrependedModerationEventId,
}: Props) {
  const listRef = useRef<FlatList<ModerationEvent>>(null);
  const scrollToTop = () => listRef.current?.scrollToOffset({
    animated: true, offset: 0,
  });

  const {
    fetchedLastPage, fetchFirstPageOfModerationEvents, getCachedModerationEvent,
    fetchNextPageOfModerationEvents, moderationEvents, ready,
    removeModerationEvent,
  } = useModerationEvents({
    actions: ['block'], active: true, moderatableType: 'User',
  });

  const {
    allModels: data, removePrependedModel: removePrependedModerationEvent,
    resetPrependedModels: resetPrependedModerationEvents,
  } = usePrependedModels<Required<ModerationEvent>>({
    getCachedModel: getCachedModerationEvent,
    maybePrependedModelId: maybePrependedModerationEventId,
    models: moderationEvents,
    onNewPrependedModel: scrollToTop,
    ready,
  });

  const { ListHeaderComponent, refreshControl, refreshing } = usePullToRefresh({
    onRefresh: async () => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      clearNextPageError();

      await fetchFirstPageOfModerationEvents();
      resetPrependedModerationEvents();
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

  const ListEmptyComponent = useMemo(() => (
    <ListEmptyMessage asteriskDelimitedMessage={LIST_EMPTY_MESSAGE} />
  ), []);

  const renderItem: ListRenderItem<ModerationEvent> = useCallback(
    ({ item }) => (
      <BlockedMemberRow
        item={item}
        onItemRemoved={() => {
          removeModerationEvent(item.id);
          removePrependedModerationEvent(item.id);
        }}
      />
    ),
    [removeModerationEvent],
  );

  return (
    <FlatList
      contentContainerStyle={contentContainerStyle}
      data={data}
      ItemSeparatorComponent={ItemSeparator}
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={ready ? ListEmptyComponent : null}
      ListFooterComponent={ListFooterComponent}
      ListHeaderComponent={ListHeaderComponent}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      ref={listRef}
      refreshControl={refreshControl}
      refreshing={refreshing}
      renderItem={renderItem}
    />
  );
}
