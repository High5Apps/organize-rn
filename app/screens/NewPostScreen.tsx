import React, { useRef, useState } from 'react';
import {
  Keyboard, StyleSheet, TextInput, View,
} from 'react-native';
import {
  KeyboardAvoidingScreenBackground, MultilineTextInput, PostCategorySelector,
  PrimaryButton, TextInputRow, useRequestProgress,
} from '../components';
import {
  GENERIC_ERROR_MESSAGE, isCurrentUserData, useCachedValue, useUserContext,
} from '../model';
import type { PostCategory } from '../model';
import useTheme from '../Theme';
import { createPost } from '../networking';
import type { NewPostScreenProps } from '../navigation';

const MAX_TITLE_LENGTH = 120;
const MAX_BODY_LENGTH = 10000;
const CACHE_KEY_TITLE = 'newPostTitle';
const CACHE_KEY_BODY = 'newPostBody';

const useStyles = () => {
  const { sizes, spacing } = useTheme();

  const styles = StyleSheet.create({
    button: {
      flex: 0,
      height: sizes.buttonHeight,
      marginBottom: spacing.m,
      paddingHorizontal: spacing.m,
    },
    buttonRow: {
      flexDirection: 'row-reverse',
      marginHorizontal: spacing.m,
    },
    multilineTextInput: {
      flex: 1,
      marginHorizontal: spacing.m,
      marginBottom: spacing.m,
    },
    requestProgress: {
      marginHorizontal: spacing.m,
      marginBottom: spacing.m,
    },
    titleInputRow: {
      marginBottom: spacing.m,
    },
  });

  return { styles };
};

export default function NewPostScreen({
  navigation, route,
}: NewPostScreenProps) {
  const { category: maybeCategory } = route.params ?? {};
  const initialPostCategory = maybeCategory ?? 'general';

  const { styles } = useStyles();

  const [
    postCategory, setPostCategory,
  ] = useState<PostCategory>(initialPostCategory);
  const [body, setBody] = useCachedValue<string>(CACHE_KEY_BODY);
  const [title, setTitle] = useCachedValue<string>(CACHE_KEY_TITLE);

  const { RequestProgress, setLoading, setResult } = useRequestProgress();

  const multilineTextInputRef = useRef<TextInput | null>(null);

  const { currentUser } = useUserContext();
  if (!isCurrentUserData(currentUser)) {
    throw new Error('Expected currentUser');
  }

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
      const jwt = await currentUser.createAuthToken({ scope: '*' });

      const maybeBody = body?.length ? body : undefined;
      const { errorMessage, postCreatedAt, postId } = await createPost({
        body: maybeBody, category: postCategory, jwt, title: title!,
      });

      if (errorMessage !== undefined) {
        setResult('error', errorMessage);
        return;
      }

      resetForm();
      setResult('success', 'Successfully created post');

      navigation.navigate('DiscussTabs', {
        screen: 'Recent',
        params: { newPostCreatedAt: postCreatedAt, newPostId: postId },
      });
    } catch (error) {
      console.error(error);
      setResult('error', GENERIC_ERROR_MESSAGE);
    }
  };

  return (
    <KeyboardAvoidingScreenBackground>
      <PostCategorySelector
        onSelectionChanged={setPostCategory}
        selection={postCategory}
      />
      <TextInputRow
        // Prevents dismissing the keyboard when hitting next on Android before
        // entering any input
        blurOnSubmit={false}
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
        style={styles.titleInputRow}
        value={title}
      />
      <MultilineTextInput
        maxLength={MAX_BODY_LENGTH}
        onChangeText={setBody}
        onEndEditing={({ nativeEvent: { text } }) => setBody(text)}
        placeholder="Body (optional)"
        style={styles.multilineTextInput}
        returnKeyType="default"
        ref={multilineTextInputRef}
        value={body}
      />
      <View style={styles.buttonRow}>
        <PrimaryButton
          iconName="publish"
          label="Publish"
          onPress={onPublishPressed}
          style={styles.button}
        />
      </View>
      <RequestProgress style={styles.requestProgress} />
    </KeyboardAvoidingScreenBackground>
  );
}
