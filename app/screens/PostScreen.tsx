import React, { useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import { CommentList, PrimaryButton, ScreenBackground } from '../components';
import type { PostScreenProps } from '../navigation';
import { usePostContext } from '../model';
import useTheme from '../Theme';

function toTitleCase(s: string) {
  return s.replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}

const useStyles = () => {
  const { sizes, spacing } = useTheme();

  const buttonMarin = spacing.m;
  const buttonBoundingBoxHeight = 2 * buttonMarin + sizes.buttonHeight;

  const styles = StyleSheet.create({
    button: {
      bottom: buttonMarin,
      end: buttonMarin,
      height: sizes.buttonHeight,
      paddingHorizontal: buttonMarin,
      position: 'absolute',
    },
    listEndMessageStyle: {
      marginBottom: buttonBoundingBoxHeight,
    },
  });

  return { styles };
};

export default function PostScreen({ navigation, route }: PostScreenProps) {
  const { params: { postId } } = route;

  const { getCachedPost } = usePostContext();
  const post = getCachedPost(postId);

  const { styles } = useStyles();

  useLayoutEffect(() => {
    if (!post) { return; }

    const { category } = post;
    const capitalizedCategory = toTitleCase(category);
    navigation.setOptions({ title: capitalizedCategory });
  }, [navigation, post]);

  return (
    <ScreenBackground>
      <CommentList
        listEndMessageStyle={styles.listEndMessageStyle}
        post={post}
      />
      <PrimaryButton
        iconName="add"
        label="Comment"
        onPress={() => {
          if (!post) {
            console.warn('Expected a post to be present when commenting');
            return;
          }
          navigation.navigate('NewComment', { postId: post.id });
        }}
        style={styles.button}
      />
    </ScreenBackground>
  );
}
