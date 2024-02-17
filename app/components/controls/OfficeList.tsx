import React, { useCallback, useMemo } from 'react';
import { ListRenderItemInfo, SectionList } from 'react-native';
import { Office, isDefined, useOffices } from '../../model';
import { usePullToRefresh } from '../hooks';
import { ItemSeparator, ListEmptyMessage, renderSectionHeader } from '../views';
import OfficeRow from './OfficeRow';

const LIST_EMPTY_MESSAGE = 'Every office is currently filled or already has an open election.\n\nElections for a filled office open back up two months before the end of its term.';

type OfficeSection = {
  title: string;
  data: Office[];
};

type Props = {
  onPress: (item: Office) => void;
};

export default function OfficeList({ onPress }: Props) {
  const { fetchOffices, openOffices, ready } = useOffices();

  const sections: OfficeSection[] = useMemo(() => (
    [{ title: 'Available', data: openOffices }]
      .map((section) => (section.data.length > 0 ? section : undefined))
      .filter(isDefined)
  ), [openOffices]);

  const ListEmptyComponent = useMemo(() => (
    <ListEmptyMessage asteriskDelimitedMessage={LIST_EMPTY_MESSAGE} />
  ), []);

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
