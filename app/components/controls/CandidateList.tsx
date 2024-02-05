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
  maxSelections?: number;
  onRowPressed?: (candidate: Candidate) => void;
  selectedCandidateIds?: string[];
  waitingForDeselectedCandidateIds: string[];
  waitingForSelectedCandidateIds: string[];
};

export default function CandidateList({
  candidates, contentContainerStyle, ListFooterComponent, ListHeaderComponent,
  maxSelections: maybeMaxSelections, onRowPressed, selectedCandidateIds,
  waitingForDeselectedCandidateIds, waitingForSelectedCandidateIds,
}: Props) {
  const renderItem = useCallback(({ item }: ListRenderItemInfo<Candidate>) => {
    const { id } = item;
    const previouslySelected = selectedCandidateIds?.includes(id);
    const waitingToSelect = waitingForSelectedCandidateIds.includes(id);
    const waitingToDeselect = waitingForDeselectedCandidateIds.includes(id);
    const waitingForChange = waitingToSelect || waitingToDeselect;
    const selected = waitingForChange ? (waitingToSelect || !waitingToDeselect)
      : previouslySelected;
    const disabledDueToWaiting = waitingForSelectedCandidateIds.length > 0
      || waitingForDeselectedCandidateIds.length > 0;
    const maxSelections = maybeMaxSelections ?? 0;
    const multipleSelectionsAllowed = maxSelections > 1;
    const selectionCount = (selectedCandidateIds?.length ?? 0)
      + (waitingForSelectedCandidateIds?.length ?? 0);
    const disabledDueToMaxSelections = multipleSelectionsAllowed
      && (selectionCount >= maxSelections)
      && !selected;
    const disabled = disabledDueToWaiting || disabledDueToMaxSelections;
    return (
      <CandidateRow
        disabled={disabled}
        indicatesMultipleSelectionsAllowed={multipleSelectionsAllowed}
        item={item}
        onPress={onRowPressed}
        selected={selected}
        showDisabled={disabledDueToMaxSelections || waitingForChange}
      />
    );
  }, [
    maybeMaxSelections, onRowPressed, selectedCandidateIds,
    waitingForDeselectedCandidateIds, waitingForSelectedCandidateIds,
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
  maxSelections: undefined,
  onRowPressed: () => null,
  selectedCandidateIds: undefined,
};
