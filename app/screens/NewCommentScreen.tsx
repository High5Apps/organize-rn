import React, { useState } from 'react';
import { Keyboard, StyleSheet } from 'react-native';
import type { NewCommentScreenProps } from '../navigation';
import {
  KeyboardAvoidingScreenBackground, MultilineTextInput, PostRow, PrimaryButton,
  useRequestProgress,
} from '../components';
import useTheme from '../Theme';
import {
  GENERIC_ERROR_MESSAGE, isCurrentUserData, usePosts, useUserContext,
} from '../model';
import { createComment } from '../networking';

const MAX_COMMENT_LENGTH = 10000;

const useStyles = () => {
  const { sizes, spacing } = useTheme();

  const styles = StyleSheet.create({
    button: {
      alignSelf: 'flex-end',
      flex: 0,
      height: sizes.buttonHeight,
      marginBottom: spacing.m,
      marginEnd: spacing.m,
      paddingHorizontal: spacing.m,
    },
    multilineTextInput: {
      flex: 1,
      margin: spacing.m,
    },
    requestProgress: {
      marginHorizontal: spacing.m,
      marginBottom: spacing.m,
    },
  });

  return { styles };
};

export default function NewCommentScreen({ route }: NewCommentScreenProps) {
  const { params: { postId } } = route;
  const { getCachedPost } = usePosts();
  const post = getCachedPost(postId);

  const [body, setBody] = useState<string | undefined>();

  const { styles } = useStyles();

  const { RequestProgress, setLoading, setResult } = useRequestProgress();

  const { currentUser } = useUserContext();
  if (!isCurrentUserData(currentUser)) {
    throw new Error('Expected currentUser');
  }

  const onPublishPressed = async () => {
    Keyboard.dismiss();

    setLoading(true);
    setResult('none');

    try {
      const jwt = await currentUser.createAuthToken({ scope: '*' });
      const { errorMessage } = await createComment({
        body: body!, jwt, postId,
      });

      if (errorMessage) {
        setResult('error', errorMessage);
        return;
      }

      setBody(undefined);
      setResult('success', 'Successfully created comment');
    } catch (error) {
      console.error(error);
      setResult('error', GENERIC_ERROR_MESSAGE);
    }
  };

  return (
    <KeyboardAvoidingScreenBackground>
      {post && <PostRow disabled item={post} />}
      <MultilineTextInput
        maxLength={MAX_COMMENT_LENGTH}
        onChangeText={setBody}
        placeholder="What do you think?"
        style={styles.multilineTextInput}
        returnKeyType="default"
        value={body}
      />
      <PrimaryButton
        iconName="publish"
        label="Publish"
        onPress={onPublishPressed}
        style={styles.button}
      />
      <RequestProgress style={styles.requestProgress} />
    </KeyboardAvoidingScreenBackground>
  );
}
