import React, { useCallback, useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { CommentList, PrimaryButton, ScreenBackground } from '../../components';
import type { PostScreenProps } from '../../navigation';
import { usePosts } from '../../model';
import useTheme from '../../Theme';

function toTitleCase(s: string) {
  return s.replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}

const useStyles = () => {
  const { sizes, spacing } = useTheme();

  const buttonMargin = spacing.m;
  const buttonBoundingBoxHeight = 2 * buttonMargin + sizes.buttonHeight;

  const styles = StyleSheet.create({
    button: {
      bottom: buttonMargin,
      end: buttonMargin,
      height: sizes.buttonHeight,
      paddingHorizontal: buttonMargin,
      position: 'absolute',
    },
    listContainerStyle: {
      paddingBottom: buttonBoundingBoxHeight,
    },
  });

  return { styles };
};

export default function PostScreen({ navigation, route }: PostScreenProps) {
  const { params: { insertedComments, postId } } = route;

  const { cachePost, getCachedPost } = usePosts();
  const post = getCachedPost(postId);

  const { styles } = useStyles();

  useLayoutEffect(() => {
    if (!post) { return; }

    const { category } = post;
    const capitalizedCategory = toTitleCase(category);
    navigation.setOptions({ title: capitalizedCategory });
  }, [navigation, post]);

  const navigateToNewCommentScreen = useCallback(() => {
    if (!post) {
      console.warn('Expected a post to be present when commenting');
      return;
    }
    navigation.navigate('NewComment', { postId: post.id });
  }, [navigation, post]);

  return (
    <ScreenBackground>
      {post && (
        <CommentList
          containerStyle={styles.listContainerStyle}
          emptyListMessageOnPress={navigateToNewCommentScreen}
          insertedComments={insertedComments}
          onPostChanged={cachePost}
          post={post}
        />
      )}
      <PrimaryButton
        iconName="add"
        label="Comment"
        onPress={navigateToNewCommentScreen}
        style={styles.button}
      />
    </ScreenBackground>
  );
}