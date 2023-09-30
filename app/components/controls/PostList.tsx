import React, {
  ReactElement, useCallback, useEffect, useRef, useState,
} from 'react';
import {
  FlatList, ListRenderItemInfo, StyleProp, StyleSheet, ViewStyle,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import {
  GENERIC_ERROR_MESSAGE, Post, PostCategory, PostSort, isDefined, usePosts,
} from '../../model';
import { ItemSeparator, useRequestProgress } from '../views';
import PostRow from './PostRow';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    requestProgress: {
      margin: spacing.m,
    },
    text: {
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
      margin: spacing.m,
      textAlign: 'center',
    },
  });

  return { styles };
};

type Props = {
  category?: PostCategory;
  contentContainerStyle?: StyleProp<ViewStyle>;
  insertedPostIds?: string[];
  ListEmptyComponent: ReactElement;
  onItemPress?: (item: Post) => void;
  sort: PostSort;
};

export default function PostList({
  category, contentContainerStyle, insertedPostIds: maybeInsertedPostIds,
  ListEmptyComponent, onItemPress, sort,
}: Props) {
  const [refreshing, setRefreshing] = useState(false);
  const [insertedPostIds, setInsertedPostIds] = useState<string[]>([]);

  useEffect(() => {
    const newlyInsertedPostIds = maybeInsertedPostIds ?? [];
    setInsertedPostIds((pids) => [...newlyInsertedPostIds, ...pids]);
  }, [maybeInsertedPostIds]);

  const { styles } = useStyles();

  const listRef = useRef<FlatList<Post>>(null);
  useScrollToTop(listRef);

  const {
    cachePost, fetchedLastPage, fetchFirstPageOfPosts, fetchNextPageOfPosts,
    getCachedPost, posts, ready,
  } = usePosts({ category, sort });

  const insertedPosts = (insertedPostIds ?? []).map(getCachedPost).filter(isDefined);
  const data = [...new Set([...insertedPosts, ...posts])];

  useEffect(() => {
    if (insertedPostIds.length) {
      listRef.current?.scrollToOffset({ animated: true, offset: 0 });
    }
  }, [insertedPostIds]);

  const {
    loading: loadingNextPage, RequestProgress, result,
    setLoading: setLoadingNextPage, setResult,
  } = useRequestProgress();

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Post>) => (
    <PostRow item={item} onPress={onItemPress} onPostChanged={cachePost} />
  ), [cachePost, onItemPress]);

  const refresh = async () => {
    setRefreshing(true);
    setResult('none');

    try {
      await fetchFirstPageOfPosts();
      setInsertedPostIds([]);
    } catch (e) {
      console.error(e);
      setResult('error', GENERIC_ERROR_MESSAGE);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    refresh().catch(console.error);
  }, []);

  const ListFooterComponent = useCallback(
    () => <RequestProgress style={styles.requestProgress} />,
    [RequestProgress],
  );

  return (
    <FlatList
      data={data}
      ItemSeparatorComponent={ItemSeparator}
      ListEmptyComponent={ready ? ListEmptyComponent : null}
      ListFooterComponent={ListFooterComponent}
      contentContainerStyle={contentContainerStyle}
      onEndReached={async () => {
        if (
          !data.length || result === 'error' || loadingNextPage || refreshing
          || fetchedLastPage
        ) {
          return;
        }

        setLoadingNextPage(true);
        try {
          const { hasNextPage } = await fetchNextPageOfPosts();
          if (!hasNextPage) {
            setResult('info', 'You reached the end');
          }
        } catch (e) {
          console.error(e);
          setResult('error', GENERIC_ERROR_MESSAGE);
        }
        setLoadingNextPage(false);
      }}
      onEndReachedThreshold={0.5}
      onRefresh={refresh}
      ref={listRef}
      refreshing={refreshing}
      renderItem={renderItem}
    />
  );
}

PostList.defaultProps = {
  category: undefined,
  contentContainerStyle: {},
  insertedPostIds: undefined,
  onItemPress: () => {},
};
