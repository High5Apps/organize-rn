import React, { ReactElement, useCallback } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { ItemSeparator } from '../views';
import ResultRow from './ResultRow';
import { Result } from '../../model';

type Props = {
  ListHeaderComponent?: ReactElement;
  maxWinners?: number;
  results?: Result[];
};

export default function ResultList({
  ListHeaderComponent, maxWinners: maybeMaxWinners, results,
}: Props) {
  const maxVoteCount = results?.length ? results[0].voteCount : 0;
  const maxWinners = maybeMaxWinners ?? 0;
  const singleSelection = maxWinners === 1;
  const multiSelection = maxWinners > 1;

  const renderItem = useCallback(({
    item,
  }: ListRenderItemInfo<Result>) => {
    const { rank, voteCount } = item;
    const isAWinner = item.rank < maxWinners;
    const receivedMaxVotes = voteCount === maxVoteCount;
    const singleSelectionLoser = singleSelection && !isAWinner;
    return (
      <ResultRow
        item={item}
        multiSelectionWinnerRank={
          (multiSelection && isAWinner) ? rank : undefined
        }
        singleSelectionLoser={singleSelectionLoser && !receivedMaxVotes}
        singleSelectionTied={singleSelectionLoser && receivedMaxVotes}
        singleSelectionWinner={singleSelection && isAWinner}
      />
    );
  }, [maxVoteCount, maxWinners, multiSelection, singleSelection]);

  return (
    <FlatList
      data={results}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={ListHeaderComponent}
      renderItem={renderItem}
    />
  );
}

ResultList.defaultProps = {
  ListHeaderComponent: undefined,
  maxWinners: undefined,
  results: undefined,
};
