import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import type { NewCommentScreenProps } from '../navigation';
import {
  KeyboardAvoidingScreenBackground, MultilineTextInput, PostRow, PrimaryButton,
} from '../components';
import useTheme from '../Theme';
import { usePostContext } from '../model';

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
      marginHorizontal: spacing.m,
      marginBottom: spacing.m,
    },
  });

  return { styles };
};

export default function NewCommentScreen({ route }: NewCommentScreenProps) {
  const { params: { postId } } = route;
  const { getCachedPost } = usePostContext();
  const post = getCachedPost(postId);

  const [comment, setComment] = useState<string | undefined>();

  const { styles } = useStyles();

  return (
    <KeyboardAvoidingScreenBackground>
      {post && <PostRow disabled item={post} />}
      <MultilineTextInput
        maxLength={MAX_COMMENT_LENGTH}
        onChangeText={setComment}
        placeholder="What do you think?"
        style={styles.multilineTextInput}
        returnKeyType="default"
        value={comment}
      />
      <PrimaryButton
        iconName="publish"
        label="Publish"
        onPress={() => console.log({ postId, comment })}
        style={styles.button}
      />
    </KeyboardAvoidingScreenBackground>
  );
}
