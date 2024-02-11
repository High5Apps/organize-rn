import React, { useCallback, useMemo } from 'react';
import { ListRenderItemInfo, SectionList } from 'react-native';
import { Office, isDefined, useOffices } from '../../model';
import { usePullToRefresh } from '../hooks';
import { ItemSeparator, renderSectionHeader } from '../views';
import OfficeRow from './OfficeRow';

type OfficeSection = {
  title: string;
  data: Office[];
};

type Props = {
  onPress: (item: Office) => void;
};

export default function OfficeList({ onPress }: Props) {
  const { fetchOffices, filledOffices, openOffices } = useOffices();

  const sections: OfficeSection[] = useMemo(() => (
    [
      { title: 'Open', data: openOffices },
      { title: 'Filled', data: filledOffices },
    ]
      .map((section) => (section.data.length > 0 ? section : undefined))
      .filter(isDefined)
  ), [filledOffices, openOffices]);

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
      ListHeaderComponent={ListHeaderComponent}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      refreshControl={refreshControl}
      refreshing={refreshing}
      sections={sections}
    />
  );
}
