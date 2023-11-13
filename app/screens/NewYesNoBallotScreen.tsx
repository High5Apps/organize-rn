import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  DateTimeSelector, HeaderText, KeyboardAvoidingScreenBackground,
  MultilineTextInput, PrimaryButton, useRequestProgress,
} from '../components';
import {
  GENERIC_ERROR_MESSAGE, isCurrentUserData, useCachedValue, useUserContext,
} from '../model';
import useTheme from '../Theme';
import { createBallot } from '../networking';
import type { NewYesNoBallotScreenProps } from '../navigation';

const CACHE_KEY_QUESTION = 'newYesNoVoteQuestion';
const MAX_QUESTION_LENGTH = 120;
const CANDIDATE_TITLES = ['Yes', 'No'];
const BALLOT_CATEGORY = 'yes_no';

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
      flex: 1,
      margin: spacing.m,
      rowGap: spacing.s,
    },
    dateTimeSelector: {
      marginStart: spacing.m,
    },
    multilineTextInput: {
      marginBottom: spacing.s,
      maxHeight: 100,
    },
    spacer: {
      flex: 1,
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

export default function NewYesNoBallotScreen({
  navigation,
}: NewYesNoBallotScreenProps) {
  const [question, setQuestion] = useCachedValue<string>(CACHE_KEY_QUESTION);
  const [votingEnd, setVotingEnd] = useState(startOfNextHourIn7Days());

  const { currentUser } = useUserContext();

  const { styles } = useStyles();

  const { RequestProgress, setLoading, setResult } = useRequestProgress();

  const resetForm = () => {
    setQuestion('');
    setVotingEnd(startOfNextHourIn7Days());
    setResult('none');
  };

  const onPublishPressed = async () => {
    if (!isCurrentUserData(currentUser)) { return; }

    setLoading(true);
    setResult('none');

    const strippedQuestion = question?.trim() ?? '';
    setQuestion(strippedQuestion);

    let errorMessage: string | undefined;
    try {
      const jwt = await currentUser.createAuthToken({ scope: '*' });
      const { e2eEncrypt, e2eEncryptMany } = currentUser;

      const { errorMessage: maybeErrorMessage } = await createBallot({
        candidateTitles: CANDIDATE_TITLES,
        category: BALLOT_CATEGORY,
        e2eEncrypt,
        e2eEncryptMany,
        jwt,
        question: strippedQuestion,
        votingEndsAt: votingEnd,
      });

      if (maybeErrorMessage !== undefined) {
        errorMessage = maybeErrorMessage;
      }
    } catch (error) {
      console.error(error);
      errorMessage = GENERIC_ERROR_MESSAGE;
    }

    if (errorMessage) {
      setResult('error', { message: errorMessage });
    } else {
      resetForm();
      setResult('success');
      navigation.navigate('Ballots');
    }
  };

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
      <View style={styles.spacer} />
      <RequestProgress />
      <PrimaryButton
        iconName="publish"
        label="Publish"
        onPress={onPublishPressed}
        style={styles.button}
      />
    </KeyboardAvoidingScreenBackground>
  );
}
