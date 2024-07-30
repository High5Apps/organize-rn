import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { ModerationItem } from './types';
import { IconRow } from './rows';
import { ItemSeparator } from '../../views';
import { useMyPermissions } from '../../../model';

type Props = {
  onModerationItemPress: (moderationItem: ModerationItem) => void;
};

export default function ModerationItemList({ onModerationItemPress }: Props) {
  const { can } = useMyPermissions({ scopes: ['blockMembers', 'moderate'] });

  const moderationItems = useMemo(() => {
    const items: ModerationItem[] = [];

    if (can('blockMembers')) {
      items.push({
        destination: 'BlockedMembers',
        iconName: 'no-accounts',
        title: 'Blocked members',
      });
    }

    if (can('moderate')) {
      items.push({
        destination: 'FlagReportTabs',
        iconName: 'flag',
        title: 'Flagged Content',
      });
    }

    return items;
  }, [can]);

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
      data={moderationItems}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={renderItem}
    />
  );
}
