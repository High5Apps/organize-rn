import React from 'react';
import {
  LayoutChangeEvent, StyleSheet, Text, View,
} from 'react-native';
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
  onLayout?: (event: LayoutChangeEvent) => void;
  onPostChanged?: (post: Post) => void;
  post?: Post;
};

export default function PostWithBody({ onLayout, onPostChanged, post }: Props) {
  const { styles } = useStyles();

  if (!post) { return null; }

  const { body } = post;

  return (
    <View onLayout={onLayout}>
      <PostRow disabled item={post} onPostChanged={onPostChanged} />
      {body && <Text style={styles.body}>{body}</Text>}
    </View>
  );
}

PostWithBody.defaultProps = {
  onLayout: () => {},
  onPostChanged: () => {},
  post: undefined,
};
