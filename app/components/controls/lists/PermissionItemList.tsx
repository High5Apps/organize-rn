import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { ItemSeparator } from '../../views';
import { IconRow } from './rows';
import { PermissionItem, usePermissionItems } from '../../../model';

type Props = {
  onPermissionItemPress: (permissionItem: PermissionItem) => void;
};

export default function PermissionItemList({ onPermissionItemPress }: Props) {
  const { permissionItems } = usePermissionItems();

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
      data={permissionItems}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={renderItem}
    />
  );
}
