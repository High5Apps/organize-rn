import React, { ReactNode } from 'react';
import { Keyboard, StyleSheet } from 'react-native';
import {
  KeyboardAvoidingScreenBackground, MultilineTextInput, PrimaryButton,
  useRequestProgress,
} from '../components';
import useTheme from '../Theme';
import {
  Comment, GENERIC_ERROR_MESSAGE, MAX_COMMENT_LENGTH, isCurrentUserData,
  useCachedValue, useComments, useUserContext,
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

function getCacheKey(
  { commentId, postId }: { commentId?: string; postId?: string; },
) {
  let keyId;
  if (commentId !== undefined && postId === undefined) {
    keyId = commentId;
  } else if (commentId === undefined && postId !== undefined) {
    keyId = postId;
  } else {
    throw new Error('getCacheKey expected exactly one commentable');
  }
  return `comment-draft-${keyId}`;
}

type Props = {
  commentId?: string;
  HeaderComponent: ReactNode;
  onCommentCreated?: (commentId: string) => void;
  postId?: string;
};

export default function NewCommentScreenBase({
  commentId, HeaderComponent, onCommentCreated, postId,
}: Props) {
  const cacheKey = getCacheKey({ commentId, postId });
  const [maybeBody, setBody] = useCachedValue<string | undefined>(cacheKey);
  const body = maybeBody ?? '';

  const { styles } = useStyles();
  const { RequestProgress, setLoading, setResult } = useRequestProgress();
  const { cacheComment, getCachedComment } = useComments();

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
      const { commentId: newCommentId, errorMessage } = await createComment({
        body, commentId, jwt, postId,
      });

      if (errorMessage !== undefined) {
        setResult('error', { message: errorMessage });
        return;
      }

      setBody(undefined);
      const message = `Successfully created ${commentId ? 'reply' : 'comment'}`;
      setResult('success', { message });

      const parentComment = getCachedComment(commentId);
      const comment: Comment = {
        body,
        createdAt: new Date().getTime(),
        depth: parentComment ? (parentComment.depth + 1) : 0,
        id: newCommentId,
        myVote: 1,
        pseudonym: currentUser.pseudonym,
        score: 1,
        userId: currentUser.id,
        replies: [],
      };

      cacheComment(comment);

      onCommentCreated?.(newCommentId);
    } catch (error) {
      console.error(error);
      setResult('error', { message: GENERIC_ERROR_MESSAGE });
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
  onCommentCreated: () => {},
  postId: undefined,
};
