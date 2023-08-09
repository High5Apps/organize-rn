import React from 'react';
import {
  ActivityIndicator, FlatList, StyleSheet, Text,
} from 'react-native';
import type { Post } from '../../model';
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

type Props = {
  loading: boolean;
  posts: Post[];
};

export default function PostList({ loading, posts }: Props) {
  const { styles } = useStyles();

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

  if (posts.length === 0) {
    return (
      <Text style={styles.emptyListText}>
        Start a discussion by creating your Org&apos;s first post
      </Text>
    );
  }

  return (
    <FlatList
      data={posts}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={renderItem}
    />
  );
}
