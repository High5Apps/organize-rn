import React, { useState } from 'react';
import {
  ActivityIndicator, FlatList, StyleSheet, Text,
} from 'react-native';
import type { Post } from '../../model';
import { usePostData } from '../../model';
import { ItemSeparator } from '../views';
import PostRow from './PostRow';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    activityIndicator: {
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

export default function PostList() {
  const [refreshing, setRefreshing] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [
    hasMoreThanOnePageOfOlder, setHasMoreThanOnePageOfOlder,
  ] = useState(false);

  const { styles } = useStyles();

  const {
    posts, ready, reachedOldest, fetchNextNewerPosts, fetchNextOlderPosts,
  } = usePostData();
  const loading = !ready;

  const renderItem = ({ item }: { item: Post }) => {
    const { createdAt, pseudonym, title } = item;
    return (
      <PostRow
        createdAt={createdAt}
        pseudonym={pseudonym}
        title={title}
      />
    );
  };

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
      <Text style={styles.text}>You reached the oldest post</Text>
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
      refreshing={refreshing}
      renderItem={renderItem}
    />
  );
}
