import React, { useCallback, useMemo, useRef } from 'react';
import {
  ListRenderItemInfo, SectionList, StyleProp, ViewStyle,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { Ballot, isDefined, useBallots } from '../../model';
import { ItemSeparator, ListEmptyMessage, renderSectionHeader } from '../views';
import BallotRow from './BallotRow';
import usePullToRefresh from './PullToRefresh';
import useInfiniteScroll from './InfiniteScroll';

const LIST_EMPTY_MESSAGE = 'You can **vote on anything** or **elect officers** to represent your Org.\n\nTap the button below to get started!';

type BallotSection = {
  title: string;
  data: Ballot[];
};

type Props = {
  contentContainerStyle?: StyleProp<ViewStyle>;
  onItemPress?: (item: Ballot) => void;
};

export default function BallotList({
  contentContainerStyle, onItemPress,
}: Props) {
  const {
    activeBallots, fetchedLastPage, fetchFirstPageOfBallots,
    fetchNextPageOfBallots, inactiveBallots, ready,
  } = useBallots();

  const sections: BallotSection[] = useMemo(() => (
    [
      { title: 'Active Votes', data: activeBallots },
      { title: 'Completed Votes', data: inactiveBallots },
    ]
      .map((section) => (section.data.length > 0 ? section : undefined))
      .filter(isDefined)
  ), [activeBallots, inactiveBallots]);

  const { ListHeaderComponent, refreshControl, refreshing } = usePullToRefresh({
    onRefresh: async () => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      clearNextPageError();

      await fetchFirstPageOfBallots();
    },
    refreshOnMount: true,
  });

  const {
    clearError: clearNextPageError, ListFooterComponent, onEndReached,
    onEndReachedThreshold,
  } = useInfiniteScroll({
    getDisabled: () => (!sections.length || refreshing || fetchedLastPage),
    onLoadNextPage: fetchNextPageOfBallots,
  });

  const listRef = useRef(null);
  useScrollToTop(listRef);

  const ListEmptyComponent = useMemo(() => (
    <ListEmptyMessage asteriskDelimitedMessage={LIST_EMPTY_MESSAGE} />
  ), []);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Ballot>) => (
    <BallotRow item={item} onPress={onItemPress} />
  ), [onItemPress]);

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
    />
  );
}

BallotList.defaultProps = {
  contentContainerStyle: {},
  onItemPress: () => {},
};
