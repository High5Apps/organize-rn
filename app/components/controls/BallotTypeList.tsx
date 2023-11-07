import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import BallotTypeRow from './BallotTypeRow';
import { BallotType } from '../../model';
import { ItemSeparator } from '../views';

const data: BallotType[] = [
  {
    iconName: 'thumb-up',
    name: 'Yes or No',
  },
];

export default function BallotTypeList() {
  const renderItem: ListRenderItem<BallotType> = useCallback(({ item }) => (
    <BallotTypeRow ballotType={item} />
  ), []);

  return (
    <FlatList
      data={data}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={renderItem}
    />
  );
}
