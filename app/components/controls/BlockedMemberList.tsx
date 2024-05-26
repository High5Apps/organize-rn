import React, { useCallback, useMemo } from 'react';
import {
  FlatList, ListRenderItem, StyleProp, ViewStyle,
} from 'react-native';
import { ModerationEvent, useModerationEvents } from '../../model';
import BlockedMemberRow from './BlockedMemberRow';
import { ItemSeparator, ListEmptyMessage } from '../views';
import { useInfiniteScroll, usePullToRefresh } from '../hooks';

const LIST_EMPTY_MESSAGE = "Blocking members prevents them from accessing your Org.\n\nYou Org hasn't blocked any members.\n\nIf you need to block someone, tap the button below to get started.";

type Props = {
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export default function BlockedMemberList({ contentContainerStyle }: Props) {
  const {
    fetchedLastPage, fetchFirstPageOfModerationEvents,
    fetchNextPageOfModerationEvents, moderationEvents, ready,
  } = useModerationEvents({
    actions: ['block'], active: true, moderatableType: 'User',
  });

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

  const ListEmptyComponent = useMemo(() => (
    <ListEmptyMessage asteriskDelimitedMessage={LIST_EMPTY_MESSAGE} />
  ), []);

  const renderItem: ListRenderItem<ModerationEvent> = useCallback(
    ({ item }) => <BlockedMemberRow item={item} />,
    [],
  );

  return (
    <FlatList
      contentContainerStyle={contentContainerStyle}
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

BlockedMemberList.defaultProps = {
  contentContainerStyle: undefined,
};
