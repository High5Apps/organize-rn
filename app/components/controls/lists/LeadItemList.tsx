import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { ItemSeparator, ListEmptyMessage } from '../../views';
import { IconRow } from './rows';
import { LeadItem } from './types';
import { useMyPermissions } from '../../../model';
import usePullToRefresh from './PullToRefresh';
import { useTranslation } from '../../../i18n';

function useLeadItems() {
  const { can, ready, refreshMyPermissions } = useMyPermissions({
    scopes: [
      'blockMembers', 'editOrg', 'editPermissions', 'editWorkGroups',
      'moderate', 'viewUnionCards',
    ],
  });

  const { t } = useTranslation();

  const leadItems = useMemo(() => {
    if (!ready) { return []; }

    const items: LeadItem[] = [];

    if (can('editOrg')) {
      items.push({
        destination: 'EditOrg',
        iconName: 'edit-document',
        title: t('action.editOrgInfo'),
      });
    }

    if (can('editWorkGroups')) {
      items.push({
        destination: 'EditWorkGroups',
        iconName: 'groups',
        title: t('action.editWorkGroup', { count: 100 }),
      });
    }

    if (can('blockMembers') || can('moderate')) {
      items.push({
        destination: 'Moderation',
        iconName: 'gavel',
        title: t('object.moderation'),
      });
    }

    if (can('editPermissions')) {
      items.push({
        destination: 'Permissions',
        iconName: 'lock-open',
        title: t('object.permissions'),
      });
    }

    if (can('viewUnionCards')) {
      items.push({
        destination: 'UnionCards',
        iconName: 'badge',
        title: t('object.unionCard', { count: 100 }),
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
  const { t } = useTranslation();

  const ListEmptyComponent = useMemo(() => (
    <ListEmptyMessage asteriskDelimitedMessage={t('hint.emptyLeadItems')} />
  ), [t]);

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
