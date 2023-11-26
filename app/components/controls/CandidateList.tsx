import React, { ReactElement, useCallback } from 'react';
import {
  FlatList, ListRenderItemInfo, StyleProp, ViewStyle,
} from 'react-native';
import { Candidate } from '../../model';
import CandidateRow from './CandidateRow';
import { ItemSeparator } from '../views';

type Props = {
  candidates: Candidate[] | null;
  contentContainerStyle?: StyleProp<ViewStyle>;
  ListFooterComponent?: ReactElement;
  ListHeaderComponent?: ReactElement;
  onRowPressed?: (candidate: Candidate) => void;
  selectedCandidateIds?: string[];
};

export default function CandidateList({
  candidates, contentContainerStyle, ListFooterComponent, ListHeaderComponent,
  onRowPressed, selectedCandidateIds,
}: Props) {
  const renderItem = useCallback(({ item }: ListRenderItemInfo<Candidate>) => (
    <CandidateRow
      item={item}
      onPress={onRowPressed}
      selected={selectedCandidateIds?.includes(item.id)}
    />
  ), [onRowPressed, selectedCandidateIds]);

  return (
    <FlatList
      contentContainerStyle={contentContainerStyle}
      data={candidates}
      ListFooterComponent={(candidates !== null) ? ListFooterComponent : null}
      ListHeaderComponent={ListHeaderComponent}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={renderItem}
    />
  );
}

CandidateList.defaultProps = {
  contentContainerStyle: {},
  ListFooterComponent: undefined,
  ListHeaderComponent: undefined,
  onRowPressed: () => null,
  selectedCandidateIds: undefined,
};
