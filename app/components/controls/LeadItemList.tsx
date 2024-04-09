import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { ItemSeparator } from '../views';
import IconRow from './IconRow';
import { LeadItem } from './types';

const data: LeadItem[] = [{
  destination: 'Permissions',
  iconName: 'lock-open',
  title: 'Permissions',
}];

type Props = {
  onLeadItemPress: (leadItem: LeadItem) => void;
};

export default function LeadItemList({ onLeadItemPress }: Props) {
  const renderItem: ListRenderItem<LeadItem> = useCallback(({ item }) => {
    const { iconName, title } = item;
    return (
      <IconRow
        iconName={iconName}
        onPress={() => onLeadItemPress(item)}
        title={title}
      />
    );
  }, [onLeadItemPress]);

  return (
    <FlatList
      data={data}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={renderItem}
    />
  );
}
