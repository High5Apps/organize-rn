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
    emptyListText: {
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

  const { styles } = useStyles();

  const { posts, ready, fetchNextNewerPosts } = usePostData();
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

  return (
    <FlatList
      data={posts}
      ItemSeparatorComponent={ItemSeparator}
      ListEmptyComponent={(
        <Text style={styles.emptyListText}>
          Start a discussion by creating your Org&apos;s first post
        </Text>
      )}
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
