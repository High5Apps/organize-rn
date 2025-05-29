import React, {
  useCallback, useEffect, useLayoutEffect, useMemo,
} from 'react';
import { StyleSheet } from 'react-native';
import {
  CommentList, PostWithBody, PrimaryButton, ScreenBackground,
  useFlagHeaderButton, useRequestProgress,
} from '../../components';
import type { PostScreenProps } from '../../navigation';
import { getErrorMessage, usePost } from '../../model';
import useTheme from '../../Theme';
import { useTranslation } from '../../i18n';

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
    requestProgress: {
      margin: spacing.m,
    },
  });

  return { styles };
};

export default function PostScreen({ navigation, route }: PostScreenProps) {
  const { params: { insertedComments, postId } } = route;

  const { cachePost, post, refreshPost } = usePost({ id: postId });
  const {
    RequestProgress, setLoading, setResult,
  } = useRequestProgress({ removeWhenInactive: true });

  useFlagHeaderButton({
    hidden: !!post?.candidateId,
    navigation,
    postId,
  });

  const { styles } = useStyles();
  const { t } = useTranslation();

  useLayoutEffect(() => {
    if (!post) { return; }

    const { category } = post;
    const capitalizedCategory = toTitleCase(category);
    navigation.setOptions({ title: capitalizedCategory });
  }, [navigation, post]);

  useEffect(
    () => {
      if (post) { return; }

      async function refresh() {
        setResult('none');
        setLoading(true);

        try {
          await refreshPost();
          setResult('success');
        } catch (error) {
          const errorMessage = getErrorMessage(error);
          setResult('error', {
            message: t('result.error.tapToRetry', { errorMessage }),
            onPress: refresh,
          });
        }
      }

      refresh();
    },
    // This is needed in case the screen is reused with a different post
    [post?.id],
  );

  const navigateToNewCommentScreen = useCallback(() => {
    if (!post) {
      console.warn('Expected a post to be present when commenting');
      return;
    }
    navigation.navigate('NewComment', { postId: post.id });
  }, [navigation, post]);

  const ListHeaderComponent = useMemo(() => (
    <PostWithBody post={post} onPostChanged={cachePost} />
  ), [post]);

  return (
    <ScreenBackground>
      {post ? (
        <CommentList
          containerStyle={styles.listContainerStyle}
          emptyListMessageOnPress={navigateToNewCommentScreen}
          insertedComments={insertedComments}
          ListHeaderComponent={ListHeaderComponent}
          postId={postId}
        />
      ) : <RequestProgress style={styles.requestProgress} />}
      <PrimaryButton
        iconName="add"
        label={t('object.comment', { count: 1 })}
        onPress={navigateToNewCommentScreen}
        style={styles.button}
      />
    </ScreenBackground>
  );
}
