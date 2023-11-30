import React, { ReactElement, useCallback } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { ItemSeparator } from '../views';
import ResultRow from './ResultRow';
import { RankedResult } from '../hooks';

type Props = {
  rankedResults?: RankedResult[];
  ListHeaderComponent?: ReactElement;
};

export default function ResultList({
  rankedResults, ListHeaderComponent,
}: Props) {
  const renderItem = useCallback(({
    item,
  }: ListRenderItemInfo<RankedResult>) => (
    <ResultRow item={item} />
  ), []);

  return (
    <FlatList
      data={rankedResults}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={ListHeaderComponent}
      renderItem={renderItem}
    />
  );
}

ResultList.defaultProps = {
  ListHeaderComponent: undefined,
  rankedResults: undefined,
};
