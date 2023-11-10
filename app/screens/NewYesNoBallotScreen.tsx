import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  DateTimeSelector, HeaderText, KeyboardAvoidingScreenBackground,
  MultilineTextInput,
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
      rowGap: spacing.s,
    },
    dateTimeSelector: {
      marginStart: spacing.m,
    },
    multilineTextInput: {
      marginBottom: spacing.s,
      maxHeight: 100,
    },
  });

  return { styles };
};

function startOfNextHourIn7Days(): Date {
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  nextWeek.setHours(nextWeek.getHours() + 1);
  nextWeek.setMinutes(0, 0, 0);
  return nextWeek;
}

export default function NewYesNoBallotScreen() {
  const [question, setQuestion] = useCachedValue<string>(CACHE_KEY_QUESTION);
  const [votingEnd, setVotingEnd] = useState(startOfNextHourIn7Days());

  const { styles } = useStyles();

  return (
    <KeyboardAvoidingScreenBackground style={styles.container}>
      <HeaderText>Question</HeaderText>
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
      <HeaderText>Voting Ends On</HeaderText>
      <DateTimeSelector
        dateTime={votingEnd}
        setDateTime={setVotingEnd}
        style={styles.dateTimeSelector}
      />
    </KeyboardAvoidingScreenBackground>
  );
}
