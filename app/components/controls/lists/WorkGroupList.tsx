import React, { ReactElement, useCallback, useEffect } from 'react';
import {
  FlatList, ListRenderItem, StyleProp, ViewStyle,
} from 'react-native';
import {
  useSelectionUpdater, useUnionCard, useWorkGroups, WorkGroup,
} from '../../../model';
import usePullToRefresh from './PullToRefresh';
import { ItemSeparator } from '../../views';
import { WorkGroupRow } from './rows';

function useWorkGroupSelection(workGroups: WorkGroup[]) {
  const { cacheUnionCard, unionCard } = useUnionCard();
  const { getSelectionInfo, onRowPressed } = useSelectionUpdater({
    choices: workGroups.map(({ id }) => id),
    initialSelection: unionCard?.workGroupId ?? undefined,
    onSyncSelection: ([workGroupId]) => {
      const {
        department, jobTitle, shift,
      } = workGroups.find((workGroup) => (workGroup.id === workGroupId))!;
      cacheUnionCard({
        ...unionCard, department, jobTitle, shift, workGroupId,
      });
    },
    onSyncSelectionError: console.error,
  });

  return {
    isSelected: (wg: WorkGroup) => getSelectionInfo(wg.id).selected,
    onWorkGroupSelected: (wg: WorkGroup) => onRowPressed(wg.id),
  };
}

type Props = {
  contentContainerStyle?: StyleProp<ViewStyle>;
  ListFooterComponent?: ReactElement;
  onEditWorkGroupPress?: (workGroup: WorkGroup) => void;
  onReadyChanged?: (ready: boolean) => void;
};

export default function WorkGroupList({
  contentContainerStyle, ListFooterComponent, onEditWorkGroupPress,
  onReadyChanged,
}: Props) {
  const { ready, refreshWorkGroups, workGroups } = useWorkGroups();
  useEffect(() => onReadyChanged?.(ready), [ready]);

  const { ListHeaderComponent, refreshControl, refreshing } = usePullToRefresh({
    onRefresh: refreshWorkGroups,
    refreshOnMount: true,
  });

  const { isSelected, onWorkGroupSelected } = useWorkGroupSelection(workGroups);
  const renderItem: ListRenderItem<WorkGroup> = useCallback(({ item }) => (
    <WorkGroupRow
      item={item}
      onEditPress={onEditWorkGroupPress}
      onPress={onWorkGroupSelected}
      selectable
      selected={isSelected(item)}
    />
  ), [isSelected, onEditWorkGroupPress, onWorkGroupSelected]);

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
