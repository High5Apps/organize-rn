import React, { useRef, useState } from 'react';
import {
  Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TextInput, View,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import {
  MultilineTextInput, PostType, PostTypeSelector, PrimaryButton,
  ScreenBackground, TextInputRow,
} from '../components';
import { useCachedValue } from '../model';
import useTheme from '../Theme';

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
    keyboardAvoidingView: {
      flex: 1,
    },
    multilineTextInput: {
      flex: 1,
    },
  });

  return { styles };
};

export default function NewPostScreen() {
  const { styles } = useStyles();

  const [postType, setPostType] = useState<PostType>('general');
  const [body, setBody] = useCachedValue<string>(CACHE_KEY_BODY, '');
  const [title, setTitle] = useCachedValue<string>(CACHE_KEY_TITLE, '');

  const headerHeight = useHeaderHeight();

  const multilineTextInputRef = useRef<TextInput | null>(null);

  return (
    <ScreenBackground onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        // Setting behavior to anything besides undefined caused weird issues on
        // Android. Fortunately, it seems to work fine with undefined.
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={headerHeight}
        style={styles.keyboardAvoidingView}
      >
        <PostTypeSelector onSelectionChanged={setPostType} />
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
            onPress={() => console.log({ body, postType, title })}
            style={styles.button}
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}
