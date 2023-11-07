import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  HeaderText, KeyboardAvoidingScreenBackground, MultilineTextInput,
} from '../components';
import { useCachedValue } from '../model';
import useTheme from '../Theme';

const CACHE_KEY_QUESTION = 'newYesNoVoteQuestion';
const MAX_QUESTION_LENGTH = 120;

const useStyles = () => {
  const { spacing } = useTheme();

  const styles = StyleSheet.create({
    container: {
      padding: spacing.m,
    },
    headerText: {
      marginBottom: spacing.s,
    },
    multilineTextInput: {
      maxHeight: 100,
    },
  });

  return { styles };
};

export default function NewYesNoBallotScreen() {
  const [question, setQuestion] = useCachedValue<string>(CACHE_KEY_QUESTION);

  const { styles } = useStyles();

  return (
    <KeyboardAvoidingScreenBackground>
      <View style={styles.container}>
        <HeaderText style={styles.headerText}>Question</HeaderText>
        <MultilineTextInput
          blurOnSubmit
          enablesReturnKeyAutomatically
          maxLength={MAX_QUESTION_LENGTH}
          onChangeText={setQuestion}
          placeholder="Should we..."
          style={styles.multilineTextInput}
          returnKeyType="done"
          value={question}
        />
      </View>
    </KeyboardAvoidingScreenBackground>
  );
}
