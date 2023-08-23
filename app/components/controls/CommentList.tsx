import React from 'react';
import {
  FlatList, StyleProp, StyleSheet, Text, ViewStyle,
} from 'react-native';
import CommentRow from './CommentRow';
import useTheme from '../../Theme';
import { SectionHeader } from '../views';
import PostWithBody from './PostWithBody';
import { Post } from '../../model';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
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

  return (
    <FlatList
      data={[]}
      ListEmptyComponent={(
        <Text style={[styles.text, listEndMessageStyle]}>
          Be the first to comment on this
        </Text>
      )}
      ListHeaderComponent={(
        <>
          <PostWithBody post={post} />
          <SectionHeader>Comments</SectionHeader>
        </>
      )}
      renderItem={() => <CommentRow />}
    />
  );
}

CommentList.defaultProps = {
  listEndMessageStyle: {},
  post: undefined,
};
