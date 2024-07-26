import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { Comment, useCommentThread } from '../../model';
import { usePullToRefresh } from '../hooks';
import CommentRow from './CommentRow';
import { ItemSeparator } from '../views';

type Props = {
  commentId: string;
};

export default function CommentThreadList({ commentId }: Props) {
  const { cacheComment, comments, fetchThread } = useCommentThread(commentId);

  const {
    ListHeaderComponent, refreshControl, refreshing,
  } = usePullToRefresh({ onRefresh: fetchThread, refreshOnMount: true });

  const renderItem: ListRenderItem<Comment> = useCallback(({ item }) => (
    <CommentRow hideTextButtonRow item={item} onCommentChanged={cacheComment} />
  ), []);

  return (
    <FlatList
      data={comments}
      ListHeaderComponent={ListHeaderComponent}
      ItemSeparatorComponent={ItemSeparator}
      refreshControl={refreshControl}
      refreshing={refreshing}
      renderItem={renderItem}
    />
  );
}
