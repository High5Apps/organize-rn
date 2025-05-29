import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { ModerationItem } from './types';
import { IconRow } from './rows';
import { ItemSeparator } from '../../views';
import { useMyPermissions } from '../../../model';
import { useTranslation } from '../../../i18n';

type Props = {
  onModerationItemPress: (moderationItem: ModerationItem) => void;
};

export default function ModerationItemList({ onModerationItemPress }: Props) {
  const { can } = useMyPermissions({ scopes: ['blockMembers', 'moderate'] });
  const { t } = useTranslation();

  const moderationItems = useMemo(() => {
    const items: ModerationItem[] = [];

    if (can('blockMembers')) {
      items.push({
        destination: 'BlockedMembers',
        iconName: 'no-accounts',
        title: t('object.blockedMembers'),
      });
    }

    if (can('moderate')) {
      items.push({
        destination: 'FlagReportTabs',
        iconName: 'flag',
        title: t('object.flaggedContent'),
      });
    }

    return items;
  }, [can, t]);

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
