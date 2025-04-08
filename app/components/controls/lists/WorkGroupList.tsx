import React, { ReactElement, useCallback } from 'react';
import {
  FlatList, ListRenderItem, StyleProp, ViewStyle,
} from 'react-native';
import { useWorkGroups, WorkGroup } from '../../../model';
import usePullToRefresh from './PullToRefresh';
import { ItemSeparator } from '../../views';
import { WorkGroupRow } from './rows';

type Props = {
  contentContainerStyle?: StyleProp<ViewStyle>;
  ListFooterComponent?: ReactElement;
  onEditWorkGroupPress?: (workGroup: WorkGroup) => void;
};

export default function WorkGroupList({
  contentContainerStyle, ListFooterComponent, onEditWorkGroupPress,
}: Props) {
  const { ready, refreshWorkGroups, workGroups } = useWorkGroups();

  const { ListHeaderComponent, refreshControl, refreshing } = usePullToRefresh({
    onRefresh: refreshWorkGroups,
    refreshOnMount: true,
  });

  const renderItem: ListRenderItem<WorkGroup> = useCallback(
    ({ item }) => (
      <WorkGroupRow
        item={item}
        onEditPress={onEditWorkGroupPress}
        onPress={console.log}
        selectable
      />
    ),
    [onEditWorkGroupPress],
  );

  return (
    <FlatList
      contentContainerStyle={contentContainerStyle}
      data={workGroups}
      ItemSeparatorComponent={ItemSeparator}
      keyboardShouldPersistTaps="handled"
      ListFooterComponent={ready ? ListFooterComponent : null}
      ListHeaderComponent={ListHeaderComponent}
      refreshControl={refreshControl}
      refreshing={refreshing}
      renderItem={renderItem}
    />
  );
}
