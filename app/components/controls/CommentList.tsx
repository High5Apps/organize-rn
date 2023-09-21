import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator, FlatList, ListRenderItem, StyleProp, StyleSheet, Text,
  ViewStyle,
} from 'react-native';
import CommentRow from './CommentRow';
import useTheme from '../../Theme';
import { ItemSeparator, SectionHeader } from '../views';
import PostWithBody from './PostWithBody';
import { Comment, Post, useComments } from '../../model';

type DepthMap = [
  depth: number, comment: Comment,
];

function getDepthMap(depth: number, comments: Comment[]): DepthMap[] {
  const depthMap: DepthMap[] = [];
  comments.forEach((comment) => {
    depthMap.push([depth, comment]);

    const replyDepths = getDepthMap(1 + depth, comment.replies);
    depthMap.push(...replyDepths);
  });
  return depthMap;
}

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
  onPostChanged?: (post: Post) => void;
  post?: Post;
};

export default function CommentList({
  containerStyle, onPostChanged, post,
}: Props) {
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const { styles } = useStyles();
  const {
    comments, onCommentChanged, ready, updateComments,
  } = useComments(post?.id);
  const isInitiallyLoading = !refreshing && !ready;

  const allCommentsWithDepths = useMemo(
    () => getDepthMap(0, comments),
    [comments],
  );

  const renderItem: ListRenderItem<DepthMap> = useCallback(({
    item: [depth, comment],
  }) => (
    <CommentRow
      item={comment}
      nestedDepth={depth}
      onCommentChanged={onCommentChanged}
    />
  ), [onCommentChanged]);

  return (
    <FlatList
      data={ready ? allCommentsWithDepths : null}
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
      contentContainerStyle={containerStyle}
      onRefresh={async () => {
        setRefreshing(true);
        try {
          await updateComments();
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

CommentList.defaultProps = {
  containerStyle: {},
  onPostChanged: () => {},
  post: undefined,
};
