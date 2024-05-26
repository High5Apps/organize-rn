import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { ModerationEvent, useModerationEvents } from '../../model';
import BlockedMemberRow from './BlockedMemberRow';
import { ItemSeparator } from '../views';
import { usePullToRefresh } from '../hooks';

export default function BlockedMemberList() {
  const {
    fetchFirstPageOfModerationEvents, moderationEvents,
  } = useModerationEvents({
    actions: ['block'], active: true, moderatableType: 'User',
  });

  const { ListHeaderComponent, refreshControl, refreshing } = usePullToRefresh({
    onRefresh: fetchFirstPageOfModerationEvents,
    refreshOnMount: true,
  });

  const renderItem: ListRenderItem<ModerationEvent> = useCallback(
    ({ item }) => <BlockedMemberRow item={item} />,
    [],
  );

  return (
    <FlatList
      data={moderationEvents}
      ItemSeparatorComponent={ItemSeparator}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={ListHeaderComponent}
      refreshControl={refreshControl}
      refreshing={refreshing}
      renderItem={renderItem}
    />
  );
}
