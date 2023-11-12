import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import BallotTypeRow from './BallotTypeRow';
import { BallotType } from '../../model';
import { ItemSeparator } from '../views';

const data: BallotType[] = [
  {
    category: 'yes_no',
    iconName: 'thumb-up',
    name: 'Yes or No',
  },
];

type Props = {
  onBallotTypeRowPress: (ballotType: BallotType) => void;
};

export default function BallotTypeList({
  onBallotTypeRowPress,
}: Props) {
  const renderItem: ListRenderItem<BallotType> = useCallback(({ item }) => (
    <BallotTypeRow
      ballotType={item}
      onPress={() => onBallotTypeRowPress(item)}
    />
  ), [onBallotTypeRowPress]);

  return (
    <FlatList
      data={data}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={renderItem}
    />
  );
}
