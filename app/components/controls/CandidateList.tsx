import React, { ReactElement, useCallback, useMemo } from 'react';
import {
  FlatList, ListRenderItemInfo, StyleProp, StyleSheet, Text, ViewStyle,
} from 'react-native';
import { Ballot, Candidate } from '../../model';
import CandidateRow from './CandidateRow';
import { ItemSeparator } from '../views';
import type { DiscussButtonType } from './DiscussButton';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    listEmptyMessage: {
      paddingHorizontal: spacing.l,
    },
    text: {
      color: colors.label,
      flexShrink: 1,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
    },
  });

  return { styles };
};

type Props = {
  ballot?: Ballot;
  contentContainerStyle?: StyleProp<ViewStyle>;
  DiscussButton: DiscussButtonType;
  ListFooterComponent?: ReactElement;
  ListHeaderComponent?: ReactElement;
  onRowPressed?: (candidate: Candidate) => void;
  selectedCandidateIds?: string[];
  waitingForDeselectedCandidateIds: string[];
  waitingForSelectedCandidateIds: string[];
};

export default function CandidateList({
  ballot, contentContainerStyle, DiscussButton, ListFooterComponent,
  ListHeaderComponent, onRowPressed, selectedCandidateIds,
  waitingForDeselectedCandidateIds, waitingForSelectedCandidateIds,
}: Props) {
  const {
    candidates, maxCandidateIdsPerVote: maybeMaxSelections,
  } = ballot ?? {};
  const { styles } = useStyles();

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
    const shouldToggleSelections = (maxSelections > 1)
      || (candidates?.length === 1);
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
        DiscussButton={DiscussButton}
        indicatesSelectionToggling={shouldToggleSelections}
        item={item}
        onPress={onRowPressed}
        selected={selected}
        showDisabled={disabledDueToMaxSelections || waitingForChange}
      />
    );
  }, [
    DiscussButton, maybeMaxSelections, onRowPressed, selectedCandidateIds,
    waitingForDeselectedCandidateIds, waitingForSelectedCandidateIds,
  ]);

  const ListEmptyComponent = useMemo(() => (
    candidates && (
      <Text style={[styles.text, styles.listEmptyMessage]}>
        No one accepted a nomination
      </Text>
    )
  ), [candidates]);

  return (
    <FlatList
      contentContainerStyle={contentContainerStyle}
      data={candidates}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={(candidates?.length) ? ListFooterComponent : null}
      ListHeaderComponent={ListHeaderComponent}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={renderItem}
    />
  );
}

CandidateList.defaultProps = {
  ballot: undefined,
  contentContainerStyle: {},
  ListFooterComponent: undefined,
  ListHeaderComponent: undefined,
  onRowPressed: () => null,
  selectedCandidateIds: undefined,
};
