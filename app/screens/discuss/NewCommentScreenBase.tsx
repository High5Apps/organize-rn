import React, { ReactNode } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import {
  HeaderText, KeyboardAvoidingScreenBackground, MultilineTextInput,
  PrimaryButton, useRequestProgress,
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
    requestProgress: {
      marginHorizontal: spacing.m,
    },
    section: {
      marginHorizontal: spacing.m,
      rowGap: spacing.s,
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
  const [body, setBody] = useCachedValue<string | undefined>(cacheKey);

  const { styles } = useStyles();
  const {
    loading, RequestProgress, setLoading, setResult,
  } = useRequestProgress({ removeWhenInactive: true });
  const { createComment } = useComment();

  const onPublishPressed = async () => {
    Keyboard.dismiss();

    setLoading(true);
    setResult('none');

    try {
      const comment = await createComment({ body, commentId, postId });
      setBody(undefined);
      const message = `Successfully created ${commentId ? 'reply' : 'comment'}`;
      setResult('success', { message });
      onCommentCreated?.(comment.id);
    } catch (error) {
      setResult('error', { error });
    }
  };

  return (
    <KeyboardAvoidingScreenBackground contentContainerStyle={styles.container}>
      {HeaderComponent}
      <View style={styles.section}>
        <HeaderText>{commentId ? 'Reply' : 'Comment'}</HeaderText>
        <MultilineTextInput
          editable={!loading}
          maxLength={MAX_COMMENT_LENGTH}
          onChangeText={setBody}
          placeholder="What do you think?"
          returnKeyType="default"
          value={body}
        />
      </View>
      <RequestProgress style={styles.requestProgress} />
      <PrimaryButton
        iconName="publish"
        label="Publish"
        onPress={onPublishPressed}
        style={styles.button}
      />
    </KeyboardAvoidingScreenBackground>
  );
}
