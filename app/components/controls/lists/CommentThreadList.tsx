import React, { useCallback } from 'react';
import { FlatList, ListRenderItem, StyleSheet } from 'react-native';
import { Comment, useCommentThread } from '../../../model';
import { CommentRow } from './rows';
import { ItemSeparator } from '../../views';
import { TextButton } from '../buttons';
import useTheme from '../../../Theme';
import usePullToRefresh from './PullToRefresh';

const useStyles = () => {
  const { spacing } = useTheme();

  const styles = StyleSheet.create({
    viewPostButton: {
      padding: spacing.m,
    },
  });

  return { styles };
};

type Props = {
  commentId: string;
  onViewPostPressed?: (postId: string) => void;
};

export default function CommentThreadList({
  commentId, onViewPostPressed = () => null,
}: Props) {
  const { cacheComment, comments, fetchThread } = useCommentThread(commentId);
  const postId: string | undefined = comments[0]?.postId;

  const {
    ListHeaderComponent, refreshControl, refreshing,
  } = usePullToRefresh({ onRefresh: fetchThread, refreshOnMount: true });

  const { styles } = useStyles();

  const ListFooterComponent = useCallback(() => (!postId ? null : (
    <TextButton
      containerStyle={styles.viewPostButton}
      onPress={() => onViewPostPressed?.(postId)}
    >
      View Full Discussion
    </TextButton>
  )), [onViewPostPressed, postId]);

  const renderItem: ListRenderItem<Comment> = useCallback(({ item }) => (
    <CommentRow
      hideTextButtonRow
      highlightObjectionableContent={commentId === item.id}
      item={item}
      onCommentChanged={cacheComment}
      showBlockedContent
    />
  ), []);

  return (
    <FlatList
      data={comments}
      ListFooterComponent={ListFooterComponent}
      ListHeaderComponent={ListHeaderComponent}
      ItemSeparatorComponent={ItemSeparator}
      refreshControl={refreshControl}
      refreshing={refreshing}
      renderItem={renderItem}
    />
  );
}
