import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Post } from '../../model';
import PostRow from './PostRow';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    body: {
      backgroundColor: colors.fill,
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
      paddingHorizontal: spacing.m,
      paddingBottom: spacing.m,
    },
  });

  return { styles };
};

type Props = {
  post?: Post;
};

export default function PostWithBody({ post }: Props) {
  const { styles } = useStyles();

  if (!post) { return null; }

  const { body } = post;

  return (
    <>
      <PostRow disabled item={post} />
      {body && <Text style={styles.body}>{body}</Text>}
    </>
  );
}

PostWithBody.defaultProps = {
  post: undefined,
};
