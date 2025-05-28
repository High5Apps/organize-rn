import React, { useCallback, useMemo } from 'react';
import { ListRenderItemInfo, SectionList } from 'react-native';
import { Office, isDefined, useOfficeAvailability } from '../../../model';
import { ItemSeparator, ListEmptyMessage } from '../../views';
import { OfficeRow } from './rows';
import usePullToRefresh from './PullToRefresh';
import { renderSectionHeader } from '../SectionHeader';
import { useTranslation } from '../../../i18n';

type OfficeSection = {
  title: string;
  data: Office[];
};

type Props = {
  onPress: (item: Office) => void;
};

export default function OfficeAvailabilityList({ onPress }: Props) {
  const { t } = useTranslation();
  const { fetchOffices, openOffices, ready } = useOfficeAvailability();

  const sections: OfficeSection[] = useMemo(() => (
    [{ title: t('modifier.available'), data: openOffices }]
      .map((section) => (section.data.length > 0 ? section : undefined))
      .filter(isDefined)
  ), [openOffices]);

  const ListEmptyComponent = useMemo(() => (
    <ListEmptyMessage
      asteriskDelimitedMessage={t('hint.emptyAvailableOffices')}
    />
  ), [t]);

  const { ListHeaderComponent, refreshControl, refreshing } = usePullToRefresh({
    onRefresh: fetchOffices,
    refreshOnMount: true,
  });

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Office>) => (
      <OfficeRow
        item={item}
        onPress={item.open ? () => onPress(item) : undefined}
      />
    ),
    [onPress],
  );

  return (
    <SectionList
      ItemSeparatorComponent={ItemSeparator}
      ListEmptyComponent={ready ? ListEmptyComponent : null}
      ListHeaderComponent={ListHeaderComponent}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      refreshControl={refreshControl}
      refreshing={refreshing}
      sections={sections}
    />
  );
}
