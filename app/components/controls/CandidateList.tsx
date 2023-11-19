import React, {
  ReactElement, useCallback, useEffect, useMemo,
} from 'react';
import {
  FlatList, ListRenderItemInfo, StyleProp, StyleSheet, ViewStyle,
} from 'react-native';
import { Candidate, GENERIC_ERROR_MESSAGE, useCandidates } from '../../model';
import CandidateRow from './CandidateRow';
import { ItemSeparator } from '../views';
import useRequestProgress from './RequestProgress';
import useTheme from '../../Theme';

const useStyles = () => {
  const { spacing } = useTheme();

  const styles = StyleSheet.create({
    requestProgress: {
      marginHorizontal: spacing.m,
    },
  });

  return { styles };
};

type Props = {
  ballotId: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
  ListFooterComponent?: ReactElement;
  ListHeaderComponent?: ReactElement;
};

export default function CandidateList({
  ballotId, contentContainerStyle, ListFooterComponent, ListHeaderComponent,
}: Props) {
  const { candidates, ready, updateCandidates } = useCandidates(ballotId);
  const { styles } = useStyles();
  const { RequestProgress, setLoading, setResult } = useRequestProgress();

  async function fetchCandidates() {
    setLoading(true);
    setResult('none');

    try {
      await updateCandidates();
    } catch (error) {
      console.error(error);
      setResult('error', { message: GENERIC_ERROR_MESSAGE });
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchCandidates().catch(console.error);
  }, []);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Candidate>) => (
    <CandidateRow item={item} onPress={console.log} />
  ), []);

  const WrappedListHeaderComponent = useMemo(() => (
    <>
      {ListHeaderComponent}
      {!ready && <RequestProgress style={styles.requestProgress} />}
    </>
  ), [ListHeaderComponent, ready, styles]);

  return (
    <FlatList
      contentContainerStyle={contentContainerStyle}
      data={candidates}
      ListFooterComponent={ready ? ListFooterComponent : null}
      ListHeaderComponent={WrappedListHeaderComponent}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={renderItem}
    />
  );
}

CandidateList.defaultProps = {
  contentContainerStyle: {},
  ListFooterComponent: undefined,
  ListHeaderComponent: undefined,
};
