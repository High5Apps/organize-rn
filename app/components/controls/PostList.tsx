import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import type { Post } from '../../model';
import { ItemSeparator } from '../views';
import PostRow from './PostRow';
import useTheme from '../../Theme';

const useStyles = () => {
  const { spacing } = useTheme();

  const styles = StyleSheet.create({
    activityIndicator: {
      margin: spacing.s,
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

  return loading ? (
    <ActivityIndicator style={styles.activityIndicator} />
  ) : (
    <FlatList
      data={posts}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={renderItem}
    />
  );
}
