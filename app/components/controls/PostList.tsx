import React, {
  ReactElement, RefObject, useCallback, useEffect, useRef, useState,
} from 'react';
import {
  FlatList, ListRenderItemInfo, StyleProp, ViewStyle,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import {
  Post, PostCategory, PostSort, isDefined, usePosts,
} from '../../model';
import { ItemSeparator } from '../views';
import PostRow from './PostRow';
import usePullToRefresh from './PullToRefresh';
import useInfiniteScroll from './InfiniteScroll';

function useInsertedPosts(
  posts: Post[],
  ready: boolean,
  maybeInsertedPostIds?: string[],
) {
  const [allPosts, setAllPosts] = useState<Post[]>(posts);
  const [insertedPostIds, setInsertedPostIds] = useState<string[]>([]);

  const { getCachedPost } = usePosts();

  useEffect(() => {
    if (!ready || !maybeInsertedPostIds?.length) { return; }
    const newlyInsertedPostIds = maybeInsertedPostIds;

    // Prepend new posts to already inserted new posts
    // This is needed for the situation where the user creates multiple posts
    // without pulling-to-refresh.
    setInsertedPostIds((pids) => [...newlyInsertedPostIds, ...pids]);
  }, [maybeInsertedPostIds, ready]);

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

function useScrollToTopOnNewPost(
  listRef: RefObject<FlatList<Post>>,
  maybeInsertedPostIds?: string[],
) {
  useEffect(() => {
    if (maybeInsertedPostIds?.length) {
      listRef.current?.scrollToOffset({ animated: true, offset: 0 });
    }
  }, [listRef, maybeInsertedPostIds]);
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
  const listRef = useRef<FlatList<Post>>(null);
  useScrollToTop(listRef);

  const {
    cachePost, fetchedLastPage, fetchFirstPageOfPosts, fetchNextPageOfPosts,
    posts, ready,
  } = usePosts({ category, sort });
  const {
    allPosts: data, resetInsertedPosts,
  } = useInsertedPosts(posts, ready, maybeInsertedPostIds);
  useScrollToTopOnNewPost(listRef, maybeInsertedPostIds);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Post>) => (
    <PostRow item={item} onPress={onItemPress} onPostChanged={cachePost} />
  ), [cachePost, onItemPress]);

  const { ListHeaderComponent, refreshControl, refreshing } = usePullToRefresh({
    onRefresh: async () => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      clearNextPageError();

      await fetchFirstPageOfPosts();
      resetInsertedPosts();
    },
    refreshOnMount: true,
  });

  const {
    clearError: clearNextPageError, ListFooterComponent, onEndReached,
    onEndReachedThreshold,
  } = useInfiniteScroll({
    getDisabled: () => (!data.length || refreshing || fetchedLastPage),
    onLoadNextPage: fetchNextPageOfPosts,
  });

  return (
    <FlatList
      data={data}
      ItemSeparatorComponent={ItemSeparator}
      ListEmptyComponent={ready ? ListEmptyComponent : null}
      ListFooterComponent={ListFooterComponent}
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={contentContainerStyle}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      ref={listRef}
      refreshControl={refreshControl}
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
