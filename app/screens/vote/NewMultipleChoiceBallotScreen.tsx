import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import {
  DateTimeSelector, HeaderText, KeyboardAvoidingScreenBackground,
  MultilineTextInput, NewCandidatesControl, PrimaryButton, StepperControl,
  useRequestProgress,
} from '../../components';
import { useCachedValue } from '../../model';
import useTheme from '../../Theme';

const CACHE_KEY_CANDIDATES = 'newMultipleChoiceChoices';
const CACHE_KEY_QUESTION = 'newMultipleChoiceQuestion';
const MAX_QUESTION_LENGTH = 140;

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
      rowGap: spacing.s,
    },
    dateTimeSelector: {
      marginStart: spacing.m,
    },
    multilineTextInput: {
      marginBottom: spacing.s,
      height: 100,
    },
    scrollView: {
      flex: 1,
    },
    stepperControl: {
      marginStart: spacing.m,
    },
  });

  return { styles };
};

type DurationProps = {
  days: number;
};

function startOfNextHourIn({ days }: DurationProps): Date {
  const now = new Date();
  const nextWeek = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  nextWeek.setHours(nextWeek.getHours() + 1);
  nextWeek.setMinutes(0, 0, 0);
  return nextWeek;
}

export default function NewMultipleChoiceBallotScreen() {
  const [
    candidates, setCandidates,
  ] = useCachedValue<string[]>(CACHE_KEY_CANDIDATES);
  const [question, setQuestion] = useCachedValue<string>(CACHE_KEY_QUESTION);
  const [votingEnd, setVotingEnd] = useState(startOfNextHourIn({ days: 7 }));

  const { styles } = useStyles();

  const { RequestProgress } = useRequestProgress({ removeWhenInactive: true });

  const onPublishPressed = () => {
    console.log({ candidates, question, votingEnd });
  };

  return (
    <KeyboardAvoidingScreenBackground>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        style={styles.scrollView}
      >
        <HeaderText>Question</HeaderText>
        <MultilineTextInput
          blurOnSubmit
          enablesReturnKeyAutomatically
          maxLength={MAX_QUESTION_LENGTH}
          onChangeText={setQuestion}
          placeholder="Which should we choose?"
          style={styles.multilineTextInput}
          returnKeyType="done"
          value={question}
        />
        <HeaderText>Choices</HeaderText>
        <NewCandidatesControl
          candidates={candidates ?? ['']}
          setCandidates={setCandidates}
        />
        <HeaderText>Max Selections</HeaderText>
        <StepperControl
          max={Math.max(1, (candidates ?? []).filter((c) => c.length).length)}
          min={1}
          style={styles.stepperControl}
        />
        <HeaderText>Voting Ends On</HeaderText>
        <DateTimeSelector
          dateTime={votingEnd}
          setDateTime={setVotingEnd}
          style={styles.dateTimeSelector}
        />
        <RequestProgress />
        <PrimaryButton
          iconName="publish"
          label="Publish"
          onPress={onPublishPressed}
          style={styles.button}
        />
      </ScrollView>
    </KeyboardAvoidingScreenBackground>
  );
}
