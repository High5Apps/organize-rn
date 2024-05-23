import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { ItemSeparator, ListEmptyMessage } from '../views';
import IconRow from './IconRow';
import { LeadItem } from './types';
import { useMyPermissions } from '../../model';
import { usePullToRefresh } from '../hooks';

const LIST_EMPTY_MESSAGE = "You don't have permission to access any of these tools. You can request permissions from the president or another authorized officer.";

function useLeadItems() {
  const [leadItems, setLeadItems] = useState<LeadItem[]>([]);

  const { can, ready, refreshMyPermissions } = useMyPermissions({
    scopes: ['blockMembers', 'editOrg', 'editPermissions', 'moderate'],
  });

  useEffect(() => {
    if (!ready) { return; }

    const items: LeadItem[] = [];

    if (can('editOrg')) {
      items.push({
        destination: 'EditOrg',
        iconName: 'edit-document',
        title: 'Edit Org info',
      });
    }

    if (can('editPermissions')) {
      items.push({
        destination: 'Permissions',
        iconName: 'lock-open',
        title: 'Permissions',
      });
    }

    if (can('blockMembers') || can('moderate')) {
      items.push({
        destination: 'Moderation',
        iconName: 'gavel',
        title: 'Moderation',
      });
    }

    setLeadItems(items);
  }, [can, ready]);

  return { leadItems, ready, refreshMyPermissions };
}

type Props = {
  onLeadItemPress: (leadItem: LeadItem) => void;
};

export default function LeadItemList({ onLeadItemPress }: Props) {
  const { leadItems, ready, refreshMyPermissions } = useLeadItems();

  const ListEmptyComponent = useMemo(() => (
    <ListEmptyMessage asteriskDelimitedMessage={LIST_EMPTY_MESSAGE} />
  ), []);

  const { ListHeaderComponent, refreshControl, refreshing } = usePullToRefresh({
    onRefresh: refreshMyPermissions,
    refreshOnMount: true,
  });

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
      data={leadItems}
      ListEmptyComponent={ready ? ListEmptyComponent : null}
      ListHeaderComponent={ListHeaderComponent}
      ItemSeparatorComponent={ItemSeparator}
      refreshControl={refreshControl}
      refreshing={refreshing}
      renderItem={renderItem}
    />
  );
}
