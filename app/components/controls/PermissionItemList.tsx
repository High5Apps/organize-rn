import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { ItemSeparator } from '../views';
import IconRow from './IconRow';
import { PermissionItem } from './types';

const data: PermissionItem[] = [{
  iconName: 'lock-open',
  scope: 'editPermissions',
  title: 'Edit permissions',
}];

type Props = {
  onPermissionItemPress: (permissionItem: PermissionItem) => void;
};

export default function LeadItemList({ onPermissionItemPress }: Props) {
  const renderItem: ListRenderItem<PermissionItem> = useCallback(({ item }) => {
    const { iconName, title } = item;
    return (
      <IconRow
        iconName={iconName}
        onPress={() => onPermissionItemPress(item)}
        title={title}
      />
    );
  }, [onPermissionItemPress]);

  return (
    <FlatList
      data={data}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={renderItem}
    />
  );
}
