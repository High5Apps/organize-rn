import React, { ReactElement, useCallback } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { ItemSeparator } from '../../views';
import ResultRow from './ResultRow';
import { Result } from '../../../model';
import type { DiscussButtonType } from '../buttons';

type Props = {
  currentUserId: string;
  DiscussButton: DiscussButtonType;
  ListEmptyComponent?: ReactElement;
  ListFooterComponent?: ReactElement;
  ListHeaderComponent?: ReactElement;
  maxWinners?: number;
  onResultUpdated: (result: Result) => void;
  results?: Result[];
  termStartsAt?: Date;
};

export default function ResultList({
  currentUserId, DiscussButton, ListEmptyComponent, ListFooterComponent,
  ListHeaderComponent, maxWinners: maybeMaxWinners, onResultUpdated, results,
  termStartsAt,
}: Props) {
  const maxVoteCount = results?.length ? results[0].voteCount : 0;
  const maxWinners = maybeMaxWinners ?? 0;

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Result>) => (
    <ResultRow
      currentUserId={currentUserId}
      DiscussButton={DiscussButton}
      maxVoteCount={maxVoteCount}
      maxWinners={maxWinners}
      onResultUpdated={onResultUpdated}
      result={item}
      termStartsAt={termStartsAt}
    />
  ), [
    currentUserId, DiscussButton, maxVoteCount, maxWinners, onResultUpdated,
    termStartsAt,
  ]);

  return (
    <FlatList
      data={results}
      ItemSeparatorComponent={ItemSeparator}
      ListEmptyComponent={(results !== undefined) ? ListEmptyComponent : null}
      ListFooterComponent={ListFooterComponent}
      ListHeaderComponent={ListHeaderComponent}
      renderItem={renderItem}
    />
  );
}

ResultList.defaultProps = {
  ListEmptyComponent: undefined,
  ListFooterComponent: undefined,
  ListHeaderComponent: undefined,
  maxWinners: undefined,
  results: undefined,
  termStartsAt: undefined,
};
