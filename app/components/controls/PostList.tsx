import React from 'react';
import { FlatList } from 'react-native';
import type { Post } from '../../model';
import { ItemSeparator } from '../views';
import PostRow from './PostRow';

type Props = {
  posts: Post[];
};

export default function PostList({ posts }: Props) {
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

  return (
    <FlatList
      data={posts}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={renderItem}
    />
  );
}
