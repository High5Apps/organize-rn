import React, { useCallback, useMemo, useRef } from 'react';
import {
  ListRenderItemInfo, SectionList, StyleProp, StyleSheet, ViewStyle,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import {
  Ballot, GENERIC_ERROR_MESSAGE, isDefined, useBallots,
} from '../../model';
import { ItemSeparator, ListEmptyMessage, renderSectionHeader } from '../views';
import BallotRow from './BallotRow';
import usePullToRefresh from './PullToRefresh';
import useRequestProgress from './RequestProgress';
import useTheme from '../../Theme';

const LIST_EMPTY_MESSAGE = 'You can **vote on anything** or **elect officers** to represent your Org.\n\nTap the button below to get started!';

const useStyles = () => {
  const { spacing } = useTheme();

  const styles = StyleSheet.create({
    requestProgress: {
      margin: spacing.m,
    },
  });

  return { styles };
};

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
  const { styles } = useStyles();
  const {
    activeBallots, inactiveBallots, fetchFirstPageOfBallots, ready,
  } = useBallots();

  const sections: BallotSection[] = useMemo(() => (
    [
      { title: 'Active Votes', data: activeBallots },
      { title: 'Completed Votes', data: inactiveBallots },
    ]
      .map((section) => (section.data.length > 0 ? section : undefined))
      .filter(isDefined)
  ), [activeBallots, inactiveBallots]);

  const {
    RequestProgress: FirstPageRequestProgress,
    setResult: setFirstPageResult,
  } = useRequestProgress();

  const { refreshControl, refreshing } = usePullToRefresh({
    onRefresh: async () => {
      setFirstPageResult('none');

      try {
        await fetchFirstPageOfBallots();
      } catch (e) {
        console.error(e);
        setFirstPageResult('error', { message: GENERIC_ERROR_MESSAGE });
      }
    },
    refreshOnMount: true,
  });

  const listRef = useRef(null);
  useScrollToTop(listRef);

  const ListEmptyComponent = useMemo(() => (
    <ListEmptyMessage asteriskDelimitedMessage={LIST_EMPTY_MESSAGE} />
  ), []);

  const ListHeaderComponent = useMemo(
    () => <FirstPageRequestProgress style={styles.requestProgress} />,
    [FirstPageRequestProgress],
  );

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Ballot>) => (
    <BallotRow item={item} onPress={onItemPress} />
  ), [onItemPress]);

  return (
    <SectionList
      contentContainerStyle={contentContainerStyle}
      ItemSeparatorComponent={ItemSeparator}
      ListEmptyComponent={ready ? ListEmptyComponent : null}
      ListHeaderComponent={ListHeaderComponent}
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
