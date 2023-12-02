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
  const maxVoteCount = rankedResults?.[0].voteCount;
  const isTie = rankedResults && (
    rankedResults[1].voteCount === maxVoteCount
  );

  const renderItem = useCallback(({
    item,
  }: ListRenderItemInfo<RankedResult>) => {
    const { voteCount } = item;
    const receivedMaxVotes = voteCount === maxVoteCount;
    const winner = receivedMaxVotes && !isTie;
    const tiedWinner = receivedMaxVotes && isTie;
    return <ResultRow item={item} tiedWinner={tiedWinner} winner={winner} />;
  }, [isTie, maxVoteCount]);

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
