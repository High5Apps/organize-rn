import React, { useRef } from 'react';
import {
  Keyboard, StyleSheet, TextInput, View,
} from 'react-native';
import {
  KeyboardAvoidingScreenBackground,
  MultilineTextInput, PostType, PostTypeSelector, PrimaryButton,
  SecondaryButton, TextInputRow, useRequestProgress,
} from '../components';
import {
  ConfirmationAlert, GENERIC_ERROR_MESSAGE, isCurrentUserData, useCachedValue,
  useUserContext,
} from '../model';
import useTheme from '../Theme';
import { createPost } from '../networking';

const MAX_TITLE_LENGTH = 120;
const MAX_BODY_LENGTH = 10000;
const CACHE_KEY_TYPE = 'newPostType';
const CACHE_KEY_TITLE = 'newPostTitle';
const CACHE_KEY_BODY = 'newPostBody';

const useStyles = () => {
  const { sizes, spacing } = useTheme();

  const styles = StyleSheet.create({
    button: {
      flex: 0,
      height: sizes.buttonHeight,
      marginBottom: spacing.m,
    },
    buttonPrimary: {
      paddingHorizontal: spacing.m,
    },
    buttonSecondary: {
      paddingEnd: spacing.m,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
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

export default function NewPostScreen() {
  const { styles } = useStyles();

  const [postType, setPostType] = useCachedValue<PostType>(CACHE_KEY_TYPE, 'general');
  const [body, setBody] = useCachedValue<string>(CACHE_KEY_BODY, '');
  const [title, setTitle] = useCachedValue<string>(CACHE_KEY_TITLE, '');

  const { RequestProgress, setLoading, setResult } = useRequestProgress();

  const multilineTextInputRef = useRef<TextInput | null>(null);

  const { currentUser } = useUserContext();
  if (!isCurrentUserData(currentUser)) {
    throw new Error('Expected currentUser');
  }

  const resetForm = () => {
    setPostType('general');
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

      const category = postType ?? 'general';
      const maybeBody = body?.length ? body : undefined;
      const { errorMessage } = await createPost({
        body: maybeBody, category, jwt, title: title!,
      });

      if (errorMessage) {
        setResult('error', errorMessage);
        return;
      }

      resetForm();
      setResult('success', 'Successfully created post');
    } catch (error) {
      console.error(error);
      setResult('error', GENERIC_ERROR_MESSAGE);
    }
  };

  return (
    <KeyboardAvoidingScreenBackground>
      <PostTypeSelector
        onSelectionChanged={setPostType}
        selection={postType}
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
        <SecondaryButton
          iconName="delete"
          label="Reset"
          onPress={ConfirmationAlert({
            destructiveAction: 'Reset',
            destructiveActionInTitle: 'reset this post',
            onConfirm: resetForm,
          }).show}
          style={[styles.button, styles.buttonSecondary]}
        />
        <PrimaryButton
          iconName="publish"
          label="Publish"
          onPress={onPublishPressed}
          style={[styles.button, styles.buttonPrimary]}
        />
      </View>
      <RequestProgress style={styles.requestProgress} />
    </KeyboardAvoidingScreenBackground>
  );
}
