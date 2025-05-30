import React, { ReactElement, useCallback, useMemo } from 'react';
import {
  Alert, FlatList, ListRenderItemInfo, StyleProp, StyleSheet, Text, ViewStyle,
} from 'react-native';
import { Ballot, Candidate, useVoteUpdater } from '../../../model';
import { CandidateRow } from './rows';
import { ItemSeparator } from '../../views';
import type { DiscussButtonType } from '../buttons';
import useTheme from '../../../Theme';
import { useTranslation } from '../../../i18n';

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
  ballot, cacheBallot, contentContainerStyle = {}, DiscussButton,
  ListFooterComponent, ListHeaderComponent,
}: Props) {
  const {
    candidates, maxCandidateIdsPerVote: maybeMaxSelections,
  } = ballot ?? {};
  const { styles } = useStyles();
  const { t } = useTranslation();

  const onSyncSelectionError = (errorMessage: string) => {
    Alert.alert(t('result.error.updateVote'), errorMessage);
  };

  const { getSelectionInfo, onRowPressed } = useVoteUpdater({
    ballot, cacheBallot, onSyncSelectionError,
  });

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
        onPress={(candidate) => onRowPressed(candidate.id)}
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
        {t('hint.nomination.noneAccepted')}
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
