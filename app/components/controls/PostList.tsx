import React, {
  ReactElement, RefObject, useCallback, useEffect, useRef,
} from 'react';
import {
  FlatList, ListRenderItemInfo, StyleProp, ViewStyle,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import {
  Post, PostCategory, PostSort, usePosts, usePrependedModels,
} from '../../model';
import { ItemSeparator } from '../views';
import PostRow from './PostRow';
import usePullToRefresh from './PullToRefresh';
import useInfiniteScroll from './InfiniteScroll';

function useScrollToTopOnNewPost(
  listRef: RefObject<FlatList<Post>>,
  maybePrependedPostIds?: string[],
) {
  useEffect(() => {
    if (maybePrependedPostIds?.length) {
      listRef.current?.scrollToOffset({ animated: true, offset: 0 });
    }
  }, [listRef, maybePrependedPostIds]);
}

type Props = {
  category?: PostCategory;
  contentContainerStyle?: StyleProp<ViewStyle>;
  prependedPostIds?: string[];
  ListEmptyComponent: ReactElement;
  onItemPress?: (item: Post) => void;
  sort: PostSort;
};

export default function PostList({
  category, contentContainerStyle, prependedPostIds: maybePrependedPostIds,
  ListEmptyComponent, onItemPress, sort,
}: Props) {
  const listRef = useRef<FlatList<Post>>(null);
  useScrollToTop(listRef);

  const {
    cachePost, fetchedLastPage, fetchFirstPageOfPosts, fetchNextPageOfPosts,
    getCachedPost, posts, ready,
  } = usePosts({ category, sort });
  const {
    allModels: data, resetPrependedModels: resetPrependedPosts,
  } = usePrependedModels<Post>({
    getCachedModel: getCachedPost,
    maybePrependedModelIds: maybePrependedPostIds,
    models: posts,
    ready,
  });
  useScrollToTopOnNewPost(listRef, maybePrependedPostIds);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Post>) => (
    <PostRow item={item} onPress={onItemPress} onPostChanged={cachePost} />
  ), [cachePost, onItemPress]);

  const { ListHeaderComponent, refreshControl, refreshing } = usePullToRefresh({
    onRefresh: async () => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      clearNextPageError();

      await fetchFirstPageOfPosts();
      resetPrependedPosts();
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
  prependedPostIds: undefined,
  onItemPress: () => {},
};
