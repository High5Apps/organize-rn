import React, {
  ReactElement, RefObject, useCallback, useEffect, useRef, useState,
} from 'react';
import {
  FlatList, ListRenderItem, StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import CommentRow from './CommentRow';
import useTheme from '../../../Theme';
import { ItemSeparator, SectionHeader } from '../../views';
import { Comment, useComments } from '../../../model';
import type { InsertedComment } from '../../../navigation';
import { useRequestProgress } from '../../hooks';

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

function useScrollToOffsetOnNewTopLevelComment(
  listRef: RefObject<FlatList<Comment>>,
  maybeInsertedCommentIds?: InsertedComment[],
) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const newestComment = maybeInsertedCommentIds?.at(-1);
    if (newestComment === undefined) { return; }

    const isLatestInsertTopLevelComment = (
      newestComment.parentCommentId === undefined
    );

    if (isLatestInsertTopLevelComment) {
      listRef.current?.scrollToOffset({ animated: true, offset });
    }
  }, [listRef, maybeInsertedCommentIds]);

  return setOffset;
}

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  emptyListMessageOnPress?: () => void;
  insertedComments?: InsertedComment[];
  ListHeaderComponent?: ReactElement;
  postId: string;
};

export default function CommentList({
  containerStyle, emptyListMessageOnPress,
  insertedComments: maybeInsertedCommentIds, ListHeaderComponent, postId,
}: Props) {
  const listRef = useRef<FlatList<Comment>>(null);

  const { styles } = useStyles();
  const { cacheComment, comments, updateComments } = useComments(postId);
  const {
    allComments: data, resetInsertedComments,
  } = useInsertedComments(comments, maybeInsertedCommentIds);
  const setScrollOffset = useScrollToOffsetOnNewTopLevelComment(
    listRef,
    maybeInsertedCommentIds,
  );
  const {
    RequestProgress, result, setLoading, setResult,
  } = useRequestProgress();

  const refresh = async () => {
    setLoading(true);
    setResult('none');

    try {
      const { isEmpty } = await updateComments();
      resetInsertedComments();
      if (isEmpty) {
        setResult('info', {
          message: 'Be the first to comment on this',
          onPress: emptyListMessageOnPress,
        });
      }
    } catch (error) {
      setResult('error', { error });
    }
    setLoading(false);
  };

  const WrappedListHeaderComponent = useCallback(() => (
    <>
      <View
        onLayout={
          ({ nativeEvent: { layout: { height } } }) => setScrollOffset(height)
        }
      >
        {ListHeaderComponent}
      </View>
      <SectionHeader buttonText="Refresh" onPress={refresh}>
        Comments
      </SectionHeader>
      <RequestProgress style={styles.requestProgress} />
    </>
  ), [ListHeaderComponent, RequestProgress]);

  const renderItem: ListRenderItem<Comment> = useCallback(({ item }) => (
    <CommentRow item={item} onCommentChanged={cacheComment} />
  ), [cacheComment]);

  useEffect(() => {
    listRef.current?.scrollToOffset({ animated: false, offset: 0 });
    refresh().catch(console.error);
  }, [postId]);

  // Hide list empty message when it's not empty
  if (result === 'info' && data.length) {
    setResult('none');
  }

  return (
    <FlatList
      contentContainerStyle={containerStyle}
      data={data}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={WrappedListHeaderComponent}
      ref={listRef}
      renderItem={renderItem}
    />
  );
}

CommentList.defaultProps = {
  containerStyle: {},
  emptyListMessageOnPress: () => {},
  insertedComments: [],
  ListHeaderComponent: undefined,
};
