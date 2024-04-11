import React, { ReactElement, useCallback, useMemo } from 'react';
import {
  Alert, FlatList, ListRenderItemInfo, StyleProp, StyleSheet, Text, ViewStyle,
} from 'react-native';
import { Ballot, Candidate, useVoteUpdater } from '../../model';
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
  cacheBallot: (ballot: Ballot) => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
  DiscussButton: DiscussButtonType;
  ListFooterComponent?: ReactElement;
  ListHeaderComponent?: ReactElement;
};

export default function CandidateList({
  ballot, cacheBallot, contentContainerStyle, DiscussButton,
  ListFooterComponent, ListHeaderComponent,
}: Props) {
  const {
    candidates, maxCandidateIdsPerVote: maybeMaxSelections,
  } = ballot ?? {};
  const { styles } = useStyles();

  const {
    getSelectionInfo, onNewCandidateSelection,
  } = useVoteUpdater({ ballot, cacheBallot });

  const onRowPressed = useCallback(async (candidate: Candidate) => {
    try {
      await onNewCandidateSelection(candidate.id);
    } catch (error) {
      let errorMessage = 'Failed to update your vote. Please try again.';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      Alert.alert(errorMessage);
    }
  }, [onNewCandidateSelection]);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Candidate>) => {
    const { id } = item;
    const {
      disabled, selected, shouldToggleSelections, showDisabled,
    } = getSelectionInfo(id);
    return (
      <CandidateRow
        disabled={disabled}
        DiscussButton={DiscussButton}
        indicatesSelectionToggling={shouldToggleSelections}
        item={item}
        onPress={onRowPressed}
        selected={selected}
        showDisabled={showDisabled}
      />
    );
  }, [
    DiscussButton, getSelectionInfo, maybeMaxSelections, onRowPressed,
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
};
