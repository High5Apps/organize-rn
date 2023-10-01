import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList, ListRenderItem, StyleProp, StyleSheet, ViewStyle,
} from 'react-native';
import CommentRow from './CommentRow';
import useTheme from '../../Theme';
import { ItemSeparator, SectionHeader, useRequestProgress } from '../views';
import PostWithBody from './PostWithBody';
import {
  Comment, GENERIC_ERROR_MESSAGE, Post, isDefined, useComments,
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

    // Prepend new comments to already inserted new comments
    // This is needed for the situation where the user creates multiple comments
    // without pulling-to-refresh
    setInsertedCommentIds((cids) => [...newlyInsertedCommentIds, ...cids]);
  }, [maybeInsertedCommentIds]);

  useEffect(() => {
    if (insertedCommentIds === undefined) { return; }

    const insertedComments = insertedCommentIds.map(
      ({ commentId }) => getCachedComment(commentId),
    ).filter(isDefined);

    const commentsWithInserts = [...insertedComments, ...comments];
    const deduplicatedCommentsWithInserts = [...new Set(commentsWithInserts)];
    setAllComments(deduplicatedCommentsWithInserts);
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
  const { RequestProgress, setResult } = useRequestProgress();

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
