import React, { useCallback, useMemo, useRef } from 'react';
import {
  ListRenderItemInfo, SectionList, StyleProp, ViewStyle,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import {
  BallotPreview, isDefined, useBallotPreviews, usePrependedModels,
} from '../../model';
import { ItemSeparator, ListEmptyMessage, renderSectionHeader } from '../views';
import BallotPreviewRow from './BallotPreviewRow';
import { useInfiniteScroll, usePullToRefresh } from '../hooks';

const LIST_EMPTY_MESSAGE = 'You can **vote on anything** or **elect officers** to represent your Org.\n\nTap the button below to get started!';

type BallotPreviewSection = {
  title: string;
  data: BallotPreview[];
};

type Props = {
  contentContainerStyle?: StyleProp<ViewStyle>;
  onItemPress?: (item: BallotPreview) => void;
  prependedBallotIds?: string[];
};

export default function BallotPreviewList({
  contentContainerStyle, onItemPress,
  prependedBallotIds: maybePrependedBallotIds,
}: Props) {
  const listRef = useRef<SectionList<BallotPreview, BallotPreviewSection>>(null);
  useScrollToTop(listRef);
  const scrollToTop = () => {
    if (!listRef.current?.props.sections.length) { return; }
    listRef.current?.scrollToLocation({ itemIndex: 0, sectionIndex: 0 });
  };

  const {
    activeBallotPreviews, fetchedLastPage, fetchFirstPageOfBallotPreviews,
    fetchNextPageOfBallotPreviews, getCachedBallotPreview,
    inactiveBallotPreviews, ready,
  } = useBallotPreviews();

  const {
    allModels: activeBallotPreviewsAndPrepended,
    resetPrependedModels: resetPrependedBallotPreviews,
  } = usePrependedModels<BallotPreview>({
    getCachedModel: getCachedBallotPreview,
    maybePrependedModelIds: maybePrependedBallotIds,
    models: activeBallotPreviews,
    onNewPrependedModel: scrollToTop,
    ready,
  });

  const sections: BallotPreviewSection[] = useMemo(() => (
    [
      { title: 'Active votes', data: activeBallotPreviewsAndPrepended },
      { title: 'Completed votes', data: inactiveBallotPreviews },
    ]
      .map((section) => (section.data.length > 0 ? section : undefined))
      .filter(isDefined)
  ), [activeBallotPreviewsAndPrepended, inactiveBallotPreviews]);

  const { ListHeaderComponent, refreshControl, refreshing } = usePullToRefresh({
    onRefresh: async () => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      clearNextPageError();

      await fetchFirstPageOfBallotPreviews();
      resetPrependedBallotPreviews();
    },
    refreshOnMount: true,
  });

  const {
    clearError: clearNextPageError, ListFooterComponent, onEndReached,
    onEndReachedThreshold,
  } = useInfiniteScroll({
    getDisabled: () => (!sections.length || refreshing || fetchedLastPage),
    onLoadNextPage: fetchNextPageOfBallotPreviews,
  });

  const ListEmptyComponent = useMemo(() => (
    <ListEmptyMessage asteriskDelimitedMessage={LIST_EMPTY_MESSAGE} />
  ), []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<BallotPreview>) => (
      <BallotPreviewRow item={item} onPress={onItemPress} />
    ),
    [onItemPress],
  );

  return (
    <SectionList
      contentContainerStyle={contentContainerStyle}
      ItemSeparatorComponent={ItemSeparator}
      ListEmptyComponent={ready ? ListEmptyComponent : null}
      ListFooterComponent={ListFooterComponent}
      ListHeaderComponent={ListHeaderComponent}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      ref={listRef}
      refreshControl={refreshControl}
      refreshing={refreshing}
      sections={sections}
      stickySectionHeadersEnabled
    />
  );
}

BallotPreviewList.defaultProps = {
  contentContainerStyle: {},
  onItemPress: () => {},
  prependedBallotIds: undefined,
};
