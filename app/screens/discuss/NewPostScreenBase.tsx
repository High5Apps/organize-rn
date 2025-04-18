import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard, StyleSheet, TextInput, View,
} from 'react-native';
import { useCachedValue, usePost } from '../../model';
import type { Post, PostCategory } from '../../model';
import useTheme from '../../Theme';
import {
  HeaderText, KeyboardAvoidingScreenBackground, MultilineTextInput,
  PostCategorySelector, PrimaryButton, TextInputRow, useRequestProgress,
} from '../../components';

const MAX_TITLE_LENGTH = 140;
const MAX_BODY_LENGTH = 10000;
const CACHE_KEY_TITLE = 'newPostTitle';
const CACHE_KEY_BODY = 'newPostBody';

const useStyles = () => {
  const { sizes, spacing } = useTheme();

  const styles = StyleSheet.create({
    button: {
      alignSelf: 'flex-end',
      flex: 0,
      height: sizes.buttonHeight,
      paddingHorizontal: spacing.m,
    },
    container: {
      padding: spacing.m,
      rowGap: spacing.m,
    },
    requestProgress: {
      marginHorizontal: spacing.m,
    },
    section: {
      rowGap: spacing.s,
    },
  });

  return { styles };
};

function usePostTitle(titleParam?: string) {
  const [title, setTitle] = useCachedValue<string | undefined>(CACHE_KEY_TITLE);

  // If title param was included, override the cached title
  useEffect(() => {
    if (titleParam) {
      setTitle(titleParam);
    }
  }, []);

  return [title, setTitle] as const;
}

type Props = {
  candidateId?: string | null;
  initialCategory?: PostCategory;
  initialPostTitle?: string;
  onPostCreated?: (post: Post) => void;
};

export default function NewPostScreenBase({
  candidateId, initialCategory, initialPostTitle, onPostCreated = () => null,
}: Props) {
  const [
    postCategory, setPostCategory,
  ] = useState<PostCategory>(initialCategory ?? 'general');
  const [body, setBody] = useCachedValue<string>(CACHE_KEY_BODY);
  const [title, setTitle] = usePostTitle(initialPostTitle);

  const {
    loading, RequestProgress, setLoading, setResult,
  } = useRequestProgress({ removeWhenInactive: true });

  const { createPost } = usePost();

  const multilineTextInputRef = useRef<TextInput | null>(null);

  const { styles } = useStyles();

  const resetForm = () => {
    setTitle('');
    setBody('');
    setResult('none');
  };

  const onPublishPressed = async () => {
    Keyboard.dismiss();

    setLoading(true);
    setResult('none');

    try {
      const post = await createPost({
        body, candidateId, category: postCategory, title,
      });
      resetForm();
      setResult('success', { message: 'Successfully created post' });
      onPostCreated?.(post);
    } catch (error) {
      setResult('error', { error });
    }
  };

  return (
    <KeyboardAvoidingScreenBackground contentContainerStyle={styles.container}>
      {!initialCategory && (
        <View style={styles.section}>
          <HeaderText>Category</HeaderText>
          <PostCategorySelector
            disabled={loading}
            onSelectionChanged={setPostCategory}
            selection={postCategory}
          />
        </View>
      )}
      <View style={styles.section}>
        <HeaderText>Title</HeaderText>
        <TextInputRow
          editable={!loading}
          enablesReturnKeyAutomatically // iOS only
          maxLength={MAX_TITLE_LENGTH}
          onChangeText={setTitle}
          onEndEditing={({ nativeEvent: { text } }) => setTitle(text)}
          onSubmitEditing={({ nativeEvent: { text } }) => {
            if (text.length) {
              multilineTextInputRef.current?.focus();
            }
          }}
          placeholder="Enter a short title"
          // Prevents dismissing the keyboard when hitting next on Android
          // before entering any input
          submitBehavior="submit"
          value={title}
        />
      </View>
      <View style={styles.section}>
        <HeaderText>Body (optional)</HeaderText>
        <MultilineTextInput
          editable={!loading}
          maxLength={MAX_BODY_LENGTH}
          onChangeText={setBody}
          onEndEditing={({ nativeEvent: { text } }) => setBody(text)}
          placeholder="Enter any details that can't fit in the title"
          returnKeyType="default"
          ref={multilineTextInputRef}
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
