import React, { useCallback, useMemo, useRef } from 'react';
import {
  ListRenderItemInfo, SectionList, StyleProp, ViewStyle,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import {
  BallotPreview, isDefined, useBallotPreviews, usePrependedModels,
} from '../../../model';
import { ItemSeparator, ListEmptyMessage } from '../../views';
import { BallotPreviewRow } from './rows';
import usePullToRefresh from './PullToRefresh';
import useInfiniteScroll from './InfiniteScroll';
import { renderSectionHeader } from '../SectionHeader';
import { useTranslation } from '../../../i18n';

type BallotPreviewSection = {
  title: string;
  data: BallotPreview[];
};

type Props = {
  contentContainerStyle?: StyleProp<ViewStyle>;
  onItemPress?: (item: BallotPreview) => void;
  prependedBallotId?: string;
};

export default function BallotPreviewList({
  contentContainerStyle = {}, onItemPress = () => {},
  prependedBallotId: maybePrependedBallotId,
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
    maybePrependedModelId: maybePrependedBallotId,
    models: activeBallotPreviews,
    onNewPrependedModel: scrollToTop,
    ready,
  });

  const { t } = useTranslation();

  const sections: BallotPreviewSection[] = useMemo(() => (
    [
      { title: t('object.activeVotes'), data: activeBallotPreviewsAndPrepended },
      { title: t('object.completedVotes'), data: inactiveBallotPreviews },
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
    <ListEmptyMessage
      asteriskDelimitedMessage={t('hint.emptyBallotPreviews')}
    />
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
