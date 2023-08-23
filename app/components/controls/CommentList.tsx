import React from 'react';
import {
  ActivityIndicator, FlatList, StyleProp, StyleSheet, Text, ViewStyle,
} from 'react-native';
import CommentRow from './CommentRow';
import useTheme from '../../Theme';
import { ItemSeparator, SectionHeader } from '../views';
import PostWithBody from './PostWithBody';
import { Post, useComments } from '../../model';

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
      marginVertical: spacing.m,
      textAlign: 'center',
    },
  });

  return { styles };
};

type Props = {
  listEndMessageStyle?: StyleProp<ViewStyle>;
  post?: Post;
};

export default function CommentList({
  listEndMessageStyle, post,
}: Props) {
  const { styles } = useStyles();
  const { comments, ready } = useComments(post?.id);

  return (
    <FlatList
      data={comments}
      ItemSeparatorComponent={ItemSeparator}
      ListEmptyComponent={ready ? (
        <Text style={[styles.text, listEndMessageStyle]}>
          Be the first to comment on this
        </Text>
      ) : null}
      ListHeaderComponent={(
        <>
          <PostWithBody post={post} />
          <SectionHeader>Comments</SectionHeader>
          { !ready && <ActivityIndicator style={styles.activityIndicator} />}
        </>
      )}
      renderItem={({ item }) => <CommentRow item={item} />}
    />
  );
}

CommentList.defaultProps = {
  listEndMessageStyle: {},
  post: undefined,
};
