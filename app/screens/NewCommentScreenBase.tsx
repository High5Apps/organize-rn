import React, { ReactNode, useState } from 'react';
import { Keyboard, StyleSheet } from 'react-native';
import {
  KeyboardAvoidingScreenBackground, MultilineTextInput, PrimaryButton,
  useRequestProgress,
} from '../components';
import useTheme from '../Theme';
import {
  GENERIC_ERROR_MESSAGE, MAX_COMMENT_LENGTH, isCurrentUserData, useUserContext,
} from '../model';
import { createComment } from '../networking';

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

type Props = {
  commentId?: string;
  HeaderComponent: ReactNode;
  postId?: string;
};

export default function NewCommentScreenBase({
  commentId, HeaderComponent, postId,
}: Props) {
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
        body: body!, commentId, jwt, postId,
      });

      if (errorMessage) {
        setResult('error', errorMessage);
        return;
      }

      setBody(undefined);
      const message = `Successfully created ${commentId ? 'reply' : 'comment'}`;
      setResult('success', message);
    } catch (error) {
      console.error(error);
      setResult('error', GENERIC_ERROR_MESSAGE);
    }
  };

  return (
    <KeyboardAvoidingScreenBackground>
      {HeaderComponent}
      <MultilineTextInput
        autoFocus
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

NewCommentScreenBase.defaultProps = {
  commentId: undefined,
  postId: undefined,
};
