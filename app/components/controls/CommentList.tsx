import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList, ListRenderItem, StyleProp, StyleSheet, ViewStyle,
} from 'react-native';
import CommentRow from './CommentRow';
import useTheme from '../../Theme';
import { ItemSeparator, SectionHeader, useRequestProgress } from '../views';
import PostWithBody from './PostWithBody';
import {
  Comment, GENERIC_ERROR_MESSAGE, Post, useComments,
} from '../../model';
import type { InsertedComment } from '../../navigation';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    requestProgress: {
      margin: spacing.m,
    },
    text: {
      color: colors.labelSecondary,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
      marginHorizontal: spacing.m,
      marginTop: spacing.m,
      textAlign: 'center',
    },
  });

  return { styles };
};

function useInsertedComments(
  comments: Comment[],
  maybeInsertedCommentIds?: InsertedComment[],
) {
  const [allComments, setAllComments] = useState<Comment[]>(comments);
  const [
    insertedCommentIds, setInsertedCommentIds,
  ] = useState<InsertedComment[]>([]);

  const { getCachedComment } = useComments();

  useEffect(() => {
    const newlyInsertedCommentIds = maybeInsertedCommentIds ?? [];

    // Append new comments to already inserted new comments
    // This is needed for the situation where the user creates multiple comments
    // without pulling-to-refresh.
    // Modifying this order to be anything but insertion order will likely break
    // the newAllComments array construction below in subtle ways.
    setInsertedCommentIds((cids) => [...cids, ...newlyInsertedCommentIds]);
  }, [maybeInsertedCommentIds]);

  useEffect(() => {
    const newAllComments = [...comments];

    insertedCommentIds.forEach(({ commentId, parentCommentId }) => {
      const comment = getCachedComment(commentId);
      if (!comment) { return; }

      if (parentCommentId) {
        // Beware that this is searching through the array that's currently
        // being constructed. This relies on insertedCommentIds being ordered by
        // insertion order.
        const parentIndex = newAllComments.findIndex(
          (c) => c.id === parentCommentId,
        );

        if (parentIndex >= 0) {
          // Insert new reply directly below its parent
          const insertIndex = parentIndex + 1;
          newAllComments.splice(insertIndex, 0, comment);
        }
      } else {
        // Show new comments at the top of the screen
        newAllComments.unshift(comment);
      }
    });

    const deduplicatedNewAllComments = [...new Set(newAllComments)];
    setAllComments(deduplicatedNewAllComments);
  }, [comments, getCachedComment, insertedCommentIds]);

  function resetInsertedComments() {
    setInsertedCommentIds([]);
  }

  return { allComments, resetInsertedComments };
}

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  insertedComments?: InsertedComment[];
  onPostChanged?: (post: Post) => void;
  post: Post;
};

export default function CommentList({
  containerStyle, insertedComments: maybeInsertedCommentIds, onPostChanged,
  post,
}: Props) {
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const { styles } = useStyles();
  const { cacheComment, comments, updateComments } = useComments(post.id);
  const {
    allComments: data, resetInsertedComments,
  } = useInsertedComments(comments, maybeInsertedCommentIds);
  const { RequestProgress, result, setResult } = useRequestProgress();

  const ListHeaderComponent = useCallback(() => (
    <>
      <PostWithBody post={post} onPostChanged={onPostChanged} />
      <SectionHeader>Comments</SectionHeader>
      <RequestProgress style={styles.requestProgress} />
    </>
  ), [onPostChanged, post, RequestProgress]);

  const renderItem: ListRenderItem<Comment> = useCallback(({ item }) => (
    <CommentRow
      item={item}
      onCommentChanged={cacheComment}
      postId={post.id}
    />
  ), [cacheComment, post.id]);

  const refresh = async () => {
    setRefreshing(true);
    setResult('none');

    try {
      const { isEmpty } = await updateComments();
      resetInsertedComments();
      if (isEmpty) {
        setResult('info', 'Be the first to comment on this');
      }
    } catch (e) {
      console.error(e);
      setResult('error', GENERIC_ERROR_MESSAGE);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    refresh().catch(console.error);
  }, []);

  // Hide list empty message when it's not empty
  if (result === 'info' && data.length) {
    setResult('none');
  }

  return (
    <FlatList
      contentContainerStyle={containerStyle}
      data={data}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={ListHeaderComponent}
      onRefresh={refresh}
      refreshing={refreshing}
      renderItem={renderItem}
    />
  );
}

CommentList.defaultProps = {
  containerStyle: {},
  insertedComments: [],
  onPostChanged: () => {},
};
