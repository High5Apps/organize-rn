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
    initialSelection: unionCard?.workGroupId,
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
  includeLocalOnlyWorkGroups?: boolean;
  ListEmptyComponent?: ReactElement;
  ListFooterComponent?: ReactElement;
  onEditWorkGroupPress?: (workGroup: WorkGroup) => void;
  onLoadingChanged?: (loading: boolean) => void;
  onReadyChanged?: (ready: boolean) => void;
  onWorkGroupPress?: (workGroup: WorkGroup) => void;
  selectionEnabled?: boolean;
  showRowDisclosureIcons?: boolean;
};

export default function WorkGroupList({
  contentContainerStyle, includeLocalOnlyWorkGroups, ListEmptyComponent,
  ListFooterComponent, onEditWorkGroupPress, onLoadingChanged, onReadyChanged,
  onWorkGroupPress, selectionEnabled, showRowDisclosureIcons,
}: Props) {
  const {
    loading, ready, refreshWorkGroups, workGroups,
  } = useWorkGroups({ includeLocalOnlyWorkGroups });
  useEffect(() => onLoadingChanged?.(loading), [loading]);
  useEffect(() => onReadyChanged?.(ready), [ready]);

  const { ListHeaderComponent, refreshControl, refreshing } = usePullToRefresh({
    onRefresh: refreshWorkGroups,
    refreshOnMount: true,
  });

  const { isSelected, onWorkGroupSelected } = useWorkGroupSelection(workGroups);
  const renderItem: ListRenderItem<WorkGroup> = useCallback(({ item }) => (
    <WorkGroupRow
      editable={item.isLocalOnly}
      item={item}
      onEditPress={onEditWorkGroupPress}
      onPress={() => {
        if (selectionEnabled) {
          onWorkGroupSelected?.(item);
        }

        onWorkGroupPress?.(item);
      }}
      selectable={selectionEnabled}
      selected={selectionEnabled && isSelected(item)}
      showDisclosureIcon={showRowDisclosureIcons}
    />
  ), [isSelected, onEditWorkGroupPress, onWorkGroupSelected]);

  return (
    <FlatList
      contentContainerStyle={contentContainerStyle}
      data={workGroups}
      ItemSeparatorComponent={ItemSeparator}
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={ready ? ListEmptyComponent : null}
      ListFooterComponent={ready ? ListFooterComponent : null}
      ListHeaderComponent={ListHeaderComponent}
      refreshControl={refreshControl}
      refreshing={refreshing}
      renderItem={renderItem}
    />
  );
}
