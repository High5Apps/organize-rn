import React, { useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import {
  MultilineTextInput, PostType, PostTypeSelector, PrimaryButton,
  ScreenBackground, TextInputRow,
} from '../components';
import useTheme from '../Theme';

const MAX_TITLE_LENGTH = 120;
const MAX_BODY_LENGTH = 10000;

const useStyles = () => {
  const { sizes, spacing } = useTheme();

  const styles = StyleSheet.create({
    button: {
      flex: 0,
      height: sizes.buttonHeight,
      paddingHorizontal: spacing.m,
    },
    buttonRow: {
      flexDirection: 'row-reverse',
      marginHorizontal: spacing.m,
    },
  });

  return { styles };
};

export default function NewPostScreen() {
  const { styles } = useStyles();

  const [postType, setPostType] = useState<PostType>('general');
  const [body, setBody] = useState('');
  const [title, setTitle] = useState('');

  const multilineTextInputRef = useRef<TextInput | null>(null);

  return (
    <ScreenBackground>
      <PostTypeSelector onSelectionChanged={setPostType} />
      <TextInputRow
        // Prevents dismissing the keyboard when hitting next on Android before
        // entering any input
        blurOnSubmit={false}
        enablesReturnKeyAutomatically // iOS only
        maxLength={MAX_TITLE_LENGTH}
        onChangeText={setTitle}
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
        placeholder="Body (optional)"
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
    </ScreenBackground>
  );
}
