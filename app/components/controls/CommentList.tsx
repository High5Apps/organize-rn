import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import {
  ActivityIndicator, FlatList, ListRenderItem, StyleProp, StyleSheet, Text,
  ViewStyle,
} from 'react-native';
import CommentRow from './CommentRow';
import useTheme from '../../Theme';
import { ItemSeparator, SectionHeader } from '../views';
import PostWithBody from './PostWithBody';
import {
  Comment, Post, useCommentLayouts, useComments,
} from '../../model';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    activityIndicator: {
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

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  newCommentId?: string;
  onPostChanged?: (post: Post) => void;
  post: Post;
};

export default function CommentList({
  containerStyle, newCommentId, onPostChanged, post,
}: Props) {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [layoutHeight, setLayoutHeight] = useState(0);

  const listRef = useRef<FlatList<Comment>>(null);

  const { styles } = useStyles();
  const {
    cacheComment, comments, ready, updateComments,
  } = useComments(post.id);
  const isInitiallyLoading = !refreshing && !ready;

  const { heights, offsets, ready: heightsReady } = useCommentLayouts(comments);
  console.log({ heightsReady });
  if (heightsReady) { console.log({ heights, offsets }); }

  const renderItem: ListRenderItem<Comment> = useCallback(({ item }) => (
    <CommentRow
      item={item}
      onCommentChanged={cacheComment}
      postId={post.id}
    />
  ), [cacheComment, post.id]);

  const refresh = async () => {
    setRefreshing(true);
    try {
      await updateComments();
    } catch (e) {
      console.error(e);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    if (newCommentId) {
      refresh().catch(console.error);
    }
  }, [newCommentId]);

  const newCommentIndex = comments.findIndex((c) => c.id === newCommentId);
  useEffect(() => {
    if (newCommentIndex < 0 || !heightsReady) { return; }
    const itemOffset = offsets[newCommentIndex];
    const itemHeight = heights[newCommentIndex];
    const offset = itemOffset + (0.5 * (itemHeight - layoutHeight));
    console.log({ offset });
    // TODO: Don't scroll if the new comment is already visible
    listRef.current?.scrollToOffset({
      animated: true,
      offset,
    });
  }, [heights, heightsReady, listRef.current, newCommentIndex, offsets]);

  return (
    <FlatList
      contentContainerStyle={containerStyle}
      data={comments}
      // getItemLayout={heightsReady ? (_, i) => {
      //   const length = heights[i];
      //   const offset = offsets[i];
      //   const index = i;
      //   // console.log({ length, offset, index });
      //   return { length, offset, index };
      // } : undefined}
      // getItemLayout={heightsReady ? (_, i) => ({
      //   length: heights[i], offset: offsets[i], index: i,
      // }) : undefined}
      ItemSeparatorComponent={ItemSeparator}
      ListEmptyComponent={ready ? (
        <Text style={styles.text}>Be the first to comment on this</Text>
      ) : null}
      ListHeaderComponent={(
        <>
          <PostWithBody post={post} onPostChanged={onPostChanged} />
          <SectionHeader>Comments</SectionHeader>
          { isInitiallyLoading && (
            <ActivityIndicator style={styles.activityIndicator} />
          )}
        </>
      )}
      onLayout={({ nativeEvent: { layout: { height } } }) => setLayoutHeight(height)}
      onRefresh={refresh}
      onScrollToIndexFailed={(info) => {
        console.log('onScrollToIndexFailed');
        console.log({ info });
      }}
      ref={listRef}
      refreshing={refreshing}
      renderItem={renderItem}
    />
  );
}

CommentList.defaultProps = {
  containerStyle: {},
  newCommentId: undefined,
  onPostChanged: () => {},
};
