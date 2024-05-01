import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { ModerationItem } from './types';
import IconRow from './IconRow';
import { ItemSeparator } from '../views';

const MODERATION_ITEMS: ModerationItem[] = [
  {
    iconName: 'flag',
    title: 'Flagged Content',
  },
];

type Props = {
  onModerationItemPress: (leadItem: ModerationItem) => void;
};

export default function ModerationItemList({ onModerationItemPress }: Props) {
  const renderItem: ListRenderItem<ModerationItem> = useCallback(({ item }) => {
    const { iconName, title } = item;
    return (
      <IconRow
        iconName={iconName}
        onPress={() => onModerationItemPress(item)}
        title={title}
      />
    );
  }, [onModerationItemPress]);

  return (
    <FlatList
      data={MODERATION_ITEMS}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={renderItem}
    />
  );
}
