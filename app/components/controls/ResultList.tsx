import React, { ReactElement, useCallback } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { ItemSeparator } from '../views';
import ResultRow from './ResultRow';
import { Result } from '../../model';

type Props = {
  currentUserId: string;
  ListEmptyComponent?: ReactElement;
  ListFooterComponent?: ReactElement;
  ListHeaderComponent?: ReactElement;
  maxWinners?: number;
  onDiscussPressed: (postId: string) => void;
  onResultUpdated: (result: Result) => void;
  results?: Result[];
  termStartsAt?: Date;
};

export default function ResultList({
  currentUserId, ListEmptyComponent, ListFooterComponent, ListHeaderComponent,
  maxWinners: maybeMaxWinners, onDiscussPressed, onResultUpdated, results,
  termStartsAt,
}: Props) {
  const maxVoteCount = results?.length ? results[0].voteCount : 0;
  const maxWinners = maybeMaxWinners ?? 0;

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Result>) => (
    <ResultRow
      currentUserId={currentUserId}
      result={item}
      maxVoteCount={maxVoteCount}
      maxWinners={maxWinners}
      onDiscussPressed={onDiscussPressed}
      onResultUpdated={onResultUpdated}
      termStartsAt={termStartsAt}
    />
  ), [
    currentUserId, maxVoteCount, maxWinners, onDiscussPressed, onResultUpdated,
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
