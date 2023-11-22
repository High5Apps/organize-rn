import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  DateTimeSelector, HeaderText, KeyboardAvoidingScreenBackground,
  MultilineTextInput, PrimaryButton, useRequestProgress,
} from '../components';
import {
  BallotPreview, GENERIC_ERROR_MESSAGE, isCurrentUserData, useBallotPreviews,
  useCachedValue, useUserContext,
} from '../model';
import useTheme from '../Theme';
import { createBallot } from '../networking';
import type { NewYesNoBallotScreenProps } from '../navigation';

const CACHE_KEY_QUESTION = 'newYesNoVoteQuestion';
const MAX_QUESTION_LENGTH = 140;
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

  const { cacheBallotPreview } = useBallotPreviews();

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
    let id: string | undefined;
    try {
      const jwt = await currentUser.createAuthToken({ scope: '*' });
      const { e2eEncrypt, e2eEncryptMany } = currentUser;

      ({ errorMessage, id } = await createBallot({
        candidateTitles: CANDIDATE_TITLES,
        category: BALLOT_CATEGORY,
        e2eEncrypt,
        e2eEncryptMany,
        jwt,
        question: strippedQuestion,
        votingEndsAt: votingEnd,
      }));
    } catch (error) {
      console.error(error);
      errorMessage = GENERIC_ERROR_MESSAGE;
    }

    if (errorMessage !== undefined) {
      setResult('error', { message: errorMessage });
      return;
    }

    resetForm();
    setResult('success');

    const ballotPreview: BallotPreview = {
      category: BALLOT_CATEGORY,
      question: strippedQuestion,
      userId: currentUser.id,
      votingEndsAt: votingEnd,
      id: id!,
    };
    cacheBallotPreview(ballotPreview);

    navigation.navigate('BallotPreviews', {
      prependedBallotIds: [ballotPreview.id],
    });
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
