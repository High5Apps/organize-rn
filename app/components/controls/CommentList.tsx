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

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  onPostChanged?: (post: Post) => void;
  post: Post;
};

export default function CommentList({
  containerStyle, onPostChanged, post,
}: Props) {
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const { styles } = useStyles();
  const { cacheComment, comments, updateComments } = useComments(post.id);
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
      data={comments}
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
  onPostChanged: () => {},
};
