import React, { ReactNode } from 'react';
import { Keyboard, ScrollView, StyleSheet } from 'react-native';
import {
  KeyboardAvoidingScreenBackground, MultilineTextInput, PrimaryButton,
  useRequestProgress,
} from '../../components';
import useTheme from '../../Theme';
import { MAX_COMMENT_LENGTH, useCachedValue, useComment } from '../../model';

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
    container: {
      rowGap: spacing.m,
    },
    multilineTextInput: {
      marginHorizontal: spacing.m,
    },
    requestProgress: {
      marginHorizontal: spacing.m,
    },
    scrollView: {
      flex: 1,
    },
  });

  return { styles };
};

const getCacheKey = (
  { commentId, postId }: { commentId?: string; postId: string; },
) => `comment-draft-${commentId ?? postId}`;

type Props = {
  commentId?: string;
  HeaderComponent: ReactNode;
  onCommentCreated?: (commentId: string) => void;
  postId: string;
};

export default function NewCommentScreenBase({
  commentId, HeaderComponent, onCommentCreated = () => {}, postId,
}: Props) {
  const cacheKey = getCacheKey({ commentId, postId });
  const [maybeBody, setBody] = useCachedValue<string | undefined>(cacheKey);

  const { styles } = useStyles();
  const {
    loading, RequestProgress, setLoading, setResult,
  } = useRequestProgress({ removeWhenInactive: true });
  const { createComment } = useComment();

  const onPublishPressed = async () => {
    Keyboard.dismiss();

    setLoading(true);
    setResult('none');

    const strippedBody = maybeBody?.trim() ?? '';
    setBody(strippedBody);

    try {
      const comment = await createComment({
        body: strippedBody, commentId, postId,
      });
      setBody(undefined);
      const message = `Successfully created ${commentId ? 'reply' : 'comment'}`;
      setResult('success', { message });
      onCommentCreated?.(comment.id);
    } catch (error) {
      setResult('error', { error });
    }
  };

  return (
    <KeyboardAvoidingScreenBackground>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        style={styles.scrollView}
      >
        {HeaderComponent}
        <MultilineTextInput
          autoFocus
          editable={!loading}
          maxLength={MAX_COMMENT_LENGTH}
          onChangeText={setBody}
          placeholder="What do you think?"
          style={styles.multilineTextInput}
          returnKeyType="default"
          value={maybeBody}
        />
        <RequestProgress style={styles.requestProgress} />
        <PrimaryButton
          iconName="publish"
          label="Publish"
          onPress={onPublishPressed}
          style={styles.button}
        />
      </ScrollView>
    </KeyboardAvoidingScreenBackground>
  );
}
