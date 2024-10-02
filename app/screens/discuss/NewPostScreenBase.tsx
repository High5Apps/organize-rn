import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard, ScrollView, StyleSheet, TextInput, View,
} from 'react-native';
import { useCachedValue, usePost } from '../../model';
import type { Post, PostCategory } from '../../model';
import useTheme from '../../Theme';
import {
  KeyboardAvoidingScreenBackground, MultilineTextInput, PostCategorySelector,
  PrimaryButton, TextInputRow, useRequestProgress,
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

function usePostTitle(titleParam?: string) {
  const [title, setTitle] = useCachedValue<string>(CACHE_KEY_TITLE);

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

    const strippedTitle = title?.trim() ?? '';
    setTitle(strippedTitle);

    let maybeStrippedBody = body;
    if (maybeStrippedBody?.length) {
      maybeStrippedBody = maybeStrippedBody.trim();
      setBody(maybeStrippedBody);
    }

    try {
      const post = await createPost({
        body: maybeStrippedBody,
        candidateId,
        category: postCategory,
        title: strippedTitle,
      });
      resetForm();
      setResult('success', { message: 'Successfully created post' });
      onPostCreated?.(post);
    } catch (error) {
      setResult('error', { error });
    }
  };

  return (
    <KeyboardAvoidingScreenBackground>
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.scrollView}>
        {!initialCategory && (
          <PostCategorySelector
            disabled={loading}
            onSelectionChanged={setPostCategory}
            selection={postCategory}
          />
        )}
        <View style={styles.container}>
          <TextInputRow
            // Prevents dismissing the keyboard when hitting next on Android
            // before entering any input
            blurOnSubmit={false}
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
            placeholder="Title"
            value={title}
          />
          <MultilineTextInput
            editable={!loading}
            maxLength={MAX_BODY_LENGTH}
            onChangeText={setBody}
            onEndEditing={({ nativeEvent: { text } }) => setBody(text)}
            placeholder="Body (optional)"
            style={styles.multilineTextInput}
            returnKeyType="default"
            ref={multilineTextInputRef}
            value={body}
          />
          <RequestProgress style={styles.requestProgress} />
          <PrimaryButton
            iconName="publish"
            label="Publish"
            onPress={onPublishPressed}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingScreenBackground>
  );
}
