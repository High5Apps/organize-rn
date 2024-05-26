import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { ModerationEvent, useModerationEvents } from '../../model';
import BlockedMemberRow from './BlockedMemberRow';
import { ItemSeparator, ListEmptyMessage } from '../views';
import { usePullToRefresh } from '../hooks';

const LIST_EMPTY_MESSAGE = "Blocking members prevents them from accessing your Org.\n\nYou Org hasn't blocked any members.\n\nIf you need to block someone, tap the button below to get started.";

export default function BlockedMemberList() {
  const {
    fetchFirstPageOfModerationEvents, moderationEvents, ready,
  } = useModerationEvents({
    actions: ['block'], active: true, moderatableType: 'User',
  });

  const { ListHeaderComponent, refreshControl, refreshing } = usePullToRefresh({
    onRefresh: fetchFirstPageOfModerationEvents,
    refreshOnMount: true,
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
      data={moderationEvents}
      ItemSeparatorComponent={ItemSeparator}
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={ready ? ListEmptyComponent : null}
      ListHeaderComponent={ListHeaderComponent}
      refreshControl={refreshControl}
      refreshing={refreshing}
      renderItem={renderItem}
    />
  );
}
