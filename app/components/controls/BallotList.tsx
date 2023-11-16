import React, { useCallback, useRef } from 'react';
import {
  FlatList, ListRenderItemInfo, StyleProp, StyleSheet, ViewStyle,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { Ballot, GENERIC_ERROR_MESSAGE, useBallots } from '../../model';
import { ItemSeparator } from '../views';
import BallotRow from './BallotRow';
import usePullToRefresh from './PullToRefresh';
import useRequestProgress from './RequestProgress';
import useTheme from '../../Theme';

const useStyles = () => {
  const { spacing } = useTheme();

  const styles = StyleSheet.create({
    requestProgress: {
      margin: spacing.m,
    },
  });

  return { styles };
};

type Props = {
  contentContainerStyle?: StyleProp<ViewStyle>;
  onItemPress?: (item: Ballot) => void;
};

export default function BallotList({
  contentContainerStyle, onItemPress,
}: Props) {
  const { styles } = useStyles();
  const { ballots, fetchFirstPageOfBallots } = useBallots();

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

  const ListHeaderComponent = useCallback(
    () => <FirstPageRequestProgress style={styles.requestProgress} />,
    [FirstPageRequestProgress],
  );

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Ballot>) => (
    <BallotRow item={item} onPress={onItemPress} />
  ), [onItemPress]);

  return (
    <FlatList
      contentContainerStyle={contentContainerStyle}
      data={ballots}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={ListHeaderComponent}
      renderItem={renderItem}
      ref={listRef}
      refreshControl={refreshControl}
      refreshing={refreshing}
    />
  );
}

BallotList.defaultProps = {
  contentContainerStyle: {},
  onItemPress: () => {},
};
