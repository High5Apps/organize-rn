import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import {
  ActivityIndicator, FlatList, ListRenderItemInfo, StyleProp, StyleSheet, Text,
  ViewStyle,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { Post, usePosts } from '../../model';
import { ItemSeparator } from '../views';
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
  listEndMessageStyle?: StyleProp<ViewStyle>;
  onItemPress?: (item: Post) => void;
};

export default function PostList({ listEndMessageStyle, onItemPress }: Props) {
  const [refreshing, setRefreshing] = useState(false);
  const [loadingNextPage, setLoadingNextPage] = useState(false);
  const [
    fetchedAtLeastOneNextPage, setFetchedAtLeastOneNextPage,
  ] = useState(false);

  const { styles } = useStyles();

  const listRef = useRef<FlatList<Post>>(null);
  useScrollToTop(listRef);

  const {
    fetchedLastPage, fetchFirstPageOfPosts, fetchNextPageOfPosts,
    fetchPreviousPageOfPosts, posts, ready,
  } = usePosts();
  const loading = !ready;

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Post>) => (
    <PostRow item={item} onPress={onItemPress} />
  ), [onItemPress]);

  useEffect(() => {
    fetchFirstPageOfPosts().catch(console.error);
  }, []);

  if (loading) {
    return <ActivityIndicator style={styles.activityIndicator} />;
  }

  let ListFooterComponent;
  if (loadingNextPage) {
    ListFooterComponent = (
      <ActivityIndicator style={styles.activityIndicator} />
    );
  } else if (fetchedLastPage && fetchedAtLeastOneNextPage) {
    ListFooterComponent = (
      <Text style={[styles.text, styles.listEndMessage, listEndMessageStyle]}>
        You reached the end
      </Text>
    );
  }

  return (
    <FlatList
      data={posts}
      ItemSeparatorComponent={ItemSeparator}
      ListEmptyComponent={(
        <Text style={styles.text}>
          Start a discussion by creating your Org&apos;s first post
        </Text>
      )}
      ListFooterComponent={ListFooterComponent}
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
        try {
          await fetchPreviousPageOfPosts();
        } catch (e) {
          console.error(e);
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
  listEndMessageStyle: {},
  onItemPress: () => {},
};
