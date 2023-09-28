import React, {
  ReactElement, useCallback, useEffect, useRef, useState,
} from 'react';
import {
  ActivityIndicator, FlatList, ListRenderItemInfo, StyleProp, StyleSheet, Text,
  ViewStyle,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import {
  GENERIC_ERROR_MESSAGE,
  Post, PostCategory, PostSort, usePosts,
} from '../../model';
import { ItemSeparator, useRequestProgress } from '../views';
import PostRow from './PostRow';
import useTheme from '../../Theme';

const useStyles = (paddingBottom?: number) => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    activityIndicator: {
      margin: spacing.m,
    },
    listEndMessage: {
      color: colors.labelSecondary,
      marginBottom: paddingBottom,
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
  const [loadingNextPage, setLoadingNextPage] = useState(false);
  const [
    fetchedAtLeastOneNextPage, setFetchedAtLeastOneNextPage,
  ] = useState(false);

  const { styles } = useStyles();

  const listRef = useRef<FlatList<Post>>(null);
  useScrollToTop(listRef);

  const {
    cachePost, fetchedLastPage, fetchFirstPageOfPosts, fetchNextPageOfPosts,
    posts, ready,
  } = usePosts({ category, minimumCreatedBefore: newPostCreatedAt, sort });
  const loading = !ready;

  const { RequestProgress, setLoading, setResult } = useRequestProgress();

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Post>) => (
    <PostRow item={item} onPress={onItemPress} onPostChanged={cachePost} />
  ), [cachePost, onItemPress]);

  useEffect(() => {
    setLoading(true);
    fetchFirstPageOfPosts()
      .catch((e) => {
        console.error(e);
        setResult('error', GENERIC_ERROR_MESSAGE);
      })
      .finally(() => setLoading(false));
  }, [newPostCreatedAt]);

  let ListFooterComponent;
  if (loadingNextPage) {
    ListFooterComponent = (
      <ActivityIndicator style={styles.activityIndicator} />
    );
  } else if (fetchedLastPage && fetchedAtLeastOneNextPage) {
    ListFooterComponent = (
      <Text style={[styles.text, styles.listEndMessage]}>
        You reached the end
      </Text>
    );
  }

  return (
    <FlatList
      data={posts}
      ItemSeparatorComponent={ItemSeparator}
      ListEmptyComponent={loading
        ? <RequestProgress style={styles.activityIndicator} />
        : ListEmptyComponent}
      ListFooterComponent={ListFooterComponent}
      contentContainerStyle={contentContainerStyle}
      onEndReached={async () => {
        if (loading || loadingNextPage || refreshing || fetchedLastPage) { return; }

        setLoadingNextPage(true);
        try {
          await fetchNextPageOfPosts();
          if (!fetchedLastPage) {
            setFetchedAtLeastOneNextPage(true);
          }
        } catch (e) {
          console.error(e);
        }
        setLoadingNextPage(false);
      }}
      onEndReachedThreshold={0.5}
      onRefresh={async () => {
        setRefreshing(true);
        setResult('none');
        try {
          await fetchFirstPageOfPosts();
        } catch (e) {
          console.error(e);
          setResult('error', GENERIC_ERROR_MESSAGE);
        }
        setRefreshing(false);
      }}
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
