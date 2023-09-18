import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator, FlatList, ListRenderItem, StyleProp, StyleSheet, Text,
  ViewStyle,
} from 'react-native';
import CommentRow from './CommentRow';
import useTheme from '../../Theme';
import { ItemSeparator, SectionHeader } from '../views';
import PostWithBody from './PostWithBody';
import { Comment, Post, useComments } from '../../model';

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

  const renderItem: ListRenderItem<Comment> = useCallback(({ item }) => (
    <CommentRow item={item} onCommentChanged={onCommentChanged} />
  ), [onCommentChanged]);

  return (
    <FlatList
      data={ready ? comments : null}
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
