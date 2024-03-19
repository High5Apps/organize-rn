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
  onResultUpdated: (result: Result) => void;
  results?: Result[];
  termStartsAt?: Date;
};

export default function ResultList({
  currentUserId, ListEmptyComponent, ListFooterComponent, ListHeaderComponent,
  maxWinners: maybeMaxWinners, onResultUpdated, results, termStartsAt,
}: Props) {
  const maxVoteCount = results?.length ? results[0].voteCount : 0;
  const maxWinners = maybeMaxWinners ?? 0;
  const singleSelection = maxWinners === 1;
  const multiSelection = maxWinners > 1;

  const renderItem = useCallback(({
    item,
  }: ListRenderItemInfo<Result>) => {
    const { isWinner, rank, voteCount } = item;
    const receivedMaxVotes = voteCount === maxVoteCount;
    const singleSelectionLoser = singleSelection && !isWinner;
    return (
      <ResultRow
        currentUserId={currentUserId}
        item={item}
        multiSelectionWinnerRank={
          (multiSelection && isWinner) ? rank : undefined
        }
        onResultUpdated={onResultUpdated}
        singleSelectionLoser={singleSelectionLoser && !receivedMaxVotes}
        singleSelectionTied={singleSelectionLoser && receivedMaxVotes}
        singleSelectionWinner={singleSelection && isWinner}
        termStartsAt={termStartsAt}
      />
    );
  }, [
    currentUserId, maxVoteCount, maxWinners, multiSelection, singleSelection,
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
