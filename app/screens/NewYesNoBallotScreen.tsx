import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  KeyboardAvoidingScreenBackground, MultilineTextInput,
} from '../components';
import { useCachedValue } from '../model';
import useTheme from '../Theme';

const CACHE_KEY_QUESTION = 'newYesNoVoteQuestion';
const MAX_QUESTION_LENGTH = 120;

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    container: {
      padding: spacing.m,
    },
    headerText: {
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.semiBold,
      paddingBottom: spacing.s,
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
        <Text style={styles.headerText}>Question</Text>
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
