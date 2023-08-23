import React, { useState } from 'react';
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
      marginTop: spacing.m,
      textAlign: 'center',
    },
  });

  return { styles };
};

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  post?: Post;
};

export default function CommentList({ containerStyle, post }: Props) {
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const { styles } = useStyles();
  const { comments, ready, updateComments } = useComments(post?.id);
  const isInitiallyLoading = !refreshing && !ready;

  return (
    <FlatList
      data={ready ? comments : null}
      ItemSeparatorComponent={ItemSeparator}
      ListEmptyComponent={ready ? (
        <Text style={styles.text}>Be the first to comment on this</Text>
      ) : null}
      ListHeaderComponent={(
        <>
          <PostWithBody post={post} />
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
      renderItem={({ item }) => <CommentRow item={item} />}
    />
  );
}

CommentList.defaultProps = {
  containerStyle: {},
  post: undefined,
};
