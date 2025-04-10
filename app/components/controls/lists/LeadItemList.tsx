import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { ItemSeparator, ListEmptyMessage } from '../../views';
import { IconRow } from './rows';
import { LeadItem } from './types';
import { useMyPermissions } from '../../../model';
import usePullToRefresh from './PullToRefresh';

const LIST_EMPTY_MESSAGE = "You don't have permission to access any of these tools. You can request permissions from the president or another authorized officer.";

function useLeadItems() {
  const { can, ready, refreshMyPermissions } = useMyPermissions({
    scopes: [
      'blockMembers', 'editOrg', 'editPermissions', 'editWorkGroups',
      'moderate', 'viewUnionCards',
    ],
  });

  const leadItems = useMemo(() => {
    if (!ready) { return []; }

    const items: LeadItem[] = [];

    if (can('editOrg')) {
      items.push({
        destination: 'EditOrg',
        iconName: 'edit-document',
        title: 'Edit Org info',
      });
    }

    if (can('editWorkGroups')) {
      items.push({
        destination: 'EditWorkGroups',
        iconName: 'groups',
        title: 'Edit work groups',
      });
    }

    if (can('blockMembers') || can('moderate')) {
      items.push({
        destination: 'Moderation',
        iconName: 'gavel',
        title: 'Moderation',
      });
    }

    if (can('editPermissions')) {
      items.push({
        destination: 'Permissions',
        iconName: 'lock-open',
        title: 'Permissions',
      });
    }

    if (can('viewUnionCards')) {
      items.push({
        destination: 'UnionCards',
        iconName: 'badge',
        title: 'Union cards',
      });
    }

    return items;
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
