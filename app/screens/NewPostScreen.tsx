import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  MultilineTextInput, PrimaryButton, ScreenBackground, TextInputRow,
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

  const [body, setBody] = useState('');
  const [title, setTitle] = useState('');

  return (
    <ScreenBackground>
      <TextInputRow
        maxLength={MAX_TITLE_LENGTH}
        onChangeText={setTitle}
        placeholder="Title"
        value={title}
      />
      <MultilineTextInput
        maxLength={MAX_BODY_LENGTH}
        onChangeText={setBody}
        placeholder="Body (optional)"
        value={body}
      />
      <View style={styles.buttonRow}>
        <PrimaryButton
          iconName="publish"
          label="Publish"
          onPress={() => console.log({ body, title })}
          style={styles.button}
        />
      </View>
    </ScreenBackground>
  );
}
