import React from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import CommentRow from './CommentRow';
import useTheme from '../../Theme';
import { SectionHeader } from '../views';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    text: {
      color: colors.labelSecondary,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
      marginHorizontal: spacing.m,
      marginVertical: spacing.s,
      textAlign: 'center',
    },
  });

  return { styles };
};

export default function CommentList() {
  const { styles } = useStyles();

  return (
    <FlatList
      data={[]}
      ListEmptyComponent={(
        <Text style={styles.text}>Be the first to comment on this post</Text>
      )}
      ListHeaderComponent={<SectionHeader>Comments</SectionHeader>}
      renderItem={() => <CommentRow />}
    />
  );
}
