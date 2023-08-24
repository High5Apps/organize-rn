import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, FlatList, StyleProp, StyleSheet, Text, ViewStyle,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { Post, usePostContext } from '../../model';
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
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [
    hasMoreThanOnePageOfOlder, setHasMoreThanOnePageOfOlder,
  ] = useState(false);

  const { styles } = useStyles();

  const listRef = useRef<FlatList<Post>>(null);
  useScrollToTop(listRef);

  const {
    fetchNewestPosts, fetchNextNewerPosts, fetchNextOlderPosts, posts, ready,
    reachedOldest,
  } = usePostContext();
  const loading = !ready;

  useEffect(() => {
    fetchNewestPosts().catch(console.error);
  }, []);

  if (loading) {
    return <ActivityIndicator style={styles.activityIndicator} />;
  }

  let ListFooterComponent;
  if (loadingOlder) {
    ListFooterComponent = (
      <ActivityIndicator style={styles.activityIndicator} />
    );
  } else if (reachedOldest && hasMoreThanOnePageOfOlder) {
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
        if (loading || loadingOlder || refreshing || reachedOldest) { return; }

        setLoadingOlder(true);
        try {
          await fetchNextOlderPosts();
          if (!reachedOldest) {
            setHasMoreThanOnePageOfOlder(true);
          }
        } catch (e) {
          console.error(e);
        }
        setLoadingOlder(false);
      }}
      onEndReachedThreshold={0.5}
      onRefresh={async () => {
        setRefreshing(true);
        try {
          await fetchNextNewerPosts();
        } catch (e) {
          console.error(e);
        }
        setRefreshing(false);
      }}
      ref={listRef}
      refreshing={refreshing}
      renderItem={({ item }) => <PostRow item={item} onPress={onItemPress} />}
    />
  );
}

PostList.defaultProps = {
  listEndMessageStyle: {},
  onItemPress: () => {},
};
