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
  waitingForDeselectedCandidateIds: string[];
  waitingForSelectedCandidateIds: string[];
};

export default function CandidateList({
  candidates, contentContainerStyle, ListFooterComponent, ListHeaderComponent,
  onRowPressed, selectedCandidateIds, waitingForDeselectedCandidateIds,
  waitingForSelectedCandidateIds,
}: Props) {
  const renderItem = useCallback(({ item }: ListRenderItemInfo<Candidate>) => {
    const { id } = item;
    const previouslySelected = selectedCandidateIds?.includes(id);
    const waitingToSelect = waitingForSelectedCandidateIds.includes(id);
    const waitingToDeselect = waitingForDeselectedCandidateIds.includes(id);
    const waitingForChange = waitingToSelect || waitingToDeselect;
    const selected = waitingForChange ? (waitingToSelect || !waitingToDeselect)
      : previouslySelected;
    const disabled = waitingForSelectedCandidateIds.length > 0
      || waitingForDeselectedCandidateIds.length > 0;
    return (
      <CandidateRow
        disabled={disabled}
        item={item}
        onPress={onRowPressed}
        selected={selected}
        waitingForChange={waitingForChange}
      />
    );
  }, [
    onRowPressed, selectedCandidateIds, waitingForDeselectedCandidateIds,
    waitingForSelectedCandidateIds,
  ]);

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
