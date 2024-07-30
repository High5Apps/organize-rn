import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import BallotTypeRow from './BallotTypeRow';
import { BallotType, useBallotTypes } from '../../../model';
import { ItemSeparator } from '../../views';

type Props = {
  onBallotTypeRowPress: (ballotType: BallotType) => void;
};

export default function BallotTypeList({
  onBallotTypeRowPress,
}: Props) {
  const { ballotTypes } = useBallotTypes();

  const renderItem: ListRenderItem<BallotType> = useCallback(({ item }) => (
    <BallotTypeRow
      ballotType={item}
      onPress={() => onBallotTypeRowPress(item)}
    />
  ), [onBallotTypeRowPress]);

  return (
    <FlatList
      data={ballotTypes}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={renderItem}
    />
  );
}
