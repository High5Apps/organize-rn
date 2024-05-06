import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { FlaggedItem, useFlaggedItems } from '../../model';
import { ItemSeparator } from '../views';
import { usePullToRefresh } from '../hooks';
import FlaggedItemRow from './FlaggedItemRow';

type Props = {
  onItemPress?: (item: FlaggedItem) => void;
};

export default function FlaggedItemList({ onItemPress }: Props) {
  const {
    fetchFirstPageOfFlaggedItems, flaggedItems,
  } = useFlaggedItems({ sort: 'top' });

  const { ListHeaderComponent, refreshControl } = usePullToRefresh({
    onRefresh: fetchFirstPageOfFlaggedItems,
    refreshOnMount: true,
  });

  const renderItem: ListRenderItem<FlaggedItem> = useCallback(
    ({ item }) => <FlaggedItemRow item={item} onPress={onItemPress} />,
    [onItemPress],
  );

  return (
    <FlatList
      data={flaggedItems}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={ListHeaderComponent}
      keyboardShouldPersistTaps="handled"
      refreshControl={refreshControl}
      renderItem={renderItem}
    />
  );
}

FlaggedItemList.defaultProps = {
  onItemPress: undefined,
};
