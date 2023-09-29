import React, {
  ReactElement, useCallback, useEffect, useRef, useState,
} from 'react';
import {
  FlatList, ListRenderItemInfo, StyleProp, StyleSheet, ViewStyle,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import {
  GENERIC_ERROR_MESSAGE, Post, PostCategory, PostSort, usePosts,
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
  ListEmptyComponent: ReactElement;
  newPostCreatedAt?: number;
  onItemPress?: (item: Post) => void;
  sort: PostSort;
};

export default function PostList({
  category, contentContainerStyle, ListEmptyComponent, newPostCreatedAt,
  onItemPress, sort,
}: Props) {
  const [refreshing, setRefreshing] = useState(false);

  const { styles } = useStyles();

  const listRef = useRef<FlatList<Post>>(null);
  useScrollToTop(listRef);

  const {
    cachePost, fetchedLastPage, fetchFirstPageOfPosts, fetchNextPageOfPosts,
    posts, ready,
  } = usePosts({ category, minimumCreatedBefore: newPostCreatedAt, sort });

  const {
    loading: loadingNextPage, RequestProgress, result,
    setLoading: setLoadingNextPage, setResult,
  } = useRequestProgress();

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Post>) => (
    <PostRow item={item} onPress={onItemPress} onPostChanged={cachePost} />
  ), [cachePost, onItemPress]);

  const refresh = async () => {
    listRef.current?.scrollToOffset({ animated: false, offset: 0 });
    setRefreshing(true);
    setResult('none');
    try {
      await fetchFirstPageOfPosts();
    } catch (e) {
      console.error(e);
      setResult('error', GENERIC_ERROR_MESSAGE);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    refresh().catch(console.error);
  }, [newPostCreatedAt]);

  const ListFooterComponent = useCallback(
    () => <RequestProgress style={styles.requestProgress} />,
    [RequestProgress],
  );

  return (
    <FlatList
      data={posts}
      ItemSeparatorComponent={ItemSeparator}
      ListEmptyComponent={ready ? ListEmptyComponent : null}
      ListFooterComponent={ListFooterComponent}
      contentContainerStyle={contentContainerStyle}
      onEndReached={async () => {
        if (
          !posts.length || result === 'error' || loadingNextPage || refreshing
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
  newPostCreatedAt: undefined,
  onItemPress: () => {},
};
