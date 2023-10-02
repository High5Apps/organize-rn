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

function useInsertedPosts(posts: Post[], maybeInsertedPostIds?: string[]) {
  const [allPosts, setAllPosts] = useState<Post[]>(posts);
  const [insertedPostIds, setInsertedPostIds] = useState<string[]>([]);

  const { getCachedPost } = usePosts();

  useEffect(() => {
    if (!maybeInsertedPostIds?.length) { return; }
    const newlyInsertedPostIds = maybeInsertedPostIds;

    // Prepend new posts to already inserted new posts
    // This is needed for the situation where the user creates multiple posts
    // without pulling-to-refresh.
    setInsertedPostIds((pids) => [...newlyInsertedPostIds, ...pids]);
  }, [maybeInsertedPostIds]);

  useEffect(() => {
    const insertedPosts = (insertedPostIds ?? []).map(getCachedPost).filter(isDefined);
    const newAllPosts = [...insertedPosts, ...posts];
    const deduplicatednewAllPosts = [...new Set(newAllPosts)];
    setAllPosts(deduplicatednewAllPosts);
  }, [posts, getCachedPost, insertedPostIds]);

  function resetInsertedPosts() {
    setInsertedPostIds([]);
  }

  return { allPosts, resetInsertedPosts };
}

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

  const { styles } = useStyles();

  const listRef = useRef<FlatList<Post>>(null);
  useScrollToTop(listRef);

  const {
    cachePost, fetchedLastPage, fetchFirstPageOfPosts, fetchNextPageOfPosts,
    posts, ready,
  } = usePosts({ category, sort });
  const {
    allPosts: data, resetInsertedPosts,
  } = useInsertedPosts(posts, maybeInsertedPostIds);

  useEffect(() => {
    if (maybeInsertedPostIds?.length) {
      listRef.current?.scrollToOffset({ animated: true, offset: 0 });
    }
  }, [maybeInsertedPostIds]);

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
      resetInsertedPosts();
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
