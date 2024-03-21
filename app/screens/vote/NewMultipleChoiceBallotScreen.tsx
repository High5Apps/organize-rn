import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import {
  DateTimeSelector, HeaderText, KeyboardAvoidingScreenBackground,
  MultilineTextInput, NewCandidatesControl, PrimaryButton, StepperControl,
  startOfNextHourIn, useRequestProgress,
} from '../../components';
import {
  BallotPreview, GENERIC_ERROR_MESSAGE, useBallotPreviews, useCachedValue,
  useCurrentUser,
} from '../../model';
import useTheme from '../../Theme';
import { createBallot } from '../../networking';
import type { NewMultipleChoiceBallotScreenProps } from '../../navigation';

const BALLOT_CATEGORY = 'multiple_choice';
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

export default function NewMultipleChoiceBallotScreen({
  navigation,
}: NewMultipleChoiceBallotScreenProps) {
  const [
    maybeCandidates, setCandidates,
  ] = useCachedValue<string[]>(CACHE_KEY_CANDIDATES);
  const initialCandidates = [''];
  const candidates = maybeCandidates ?? initialCandidates;
  const [maxSelections, setMaxSelections] = useState(1);
  const [question, setQuestion] = useCachedValue<string>(CACHE_KEY_QUESTION);
  const [votingEnd, setVotingEnd] = useState(startOfNextHourIn({ days: 7 }));

  const { currentUser } = useCurrentUser();

  const { styles } = useStyles();

  const {
    RequestProgress, setLoading, setResult,
  } = useRequestProgress({ removeWhenInactive: true });

  const { cacheBallotPreview } = useBallotPreviews();

  const resetForm = () => {
    setCandidates(initialCandidates);
    setQuestion('');
    setVotingEnd(startOfNextHourIn({ days: 7 }));
    setResult('none');
  };

  const onPublishPressed = async () => {
    if (!currentUser) { return; }

    setLoading(true);
    setResult('none');

    const strippedQuestion = question?.trim() ?? '';
    setQuestion(strippedQuestion);

    const strippedNonemptyCandidates = candidates
      .map((c) => c.trim())
      .filter((c) => c.length);
    const uniqueCandidates = [...new Set(strippedNonemptyCandidates)];
    setCandidates(
      uniqueCandidates.length ? uniqueCandidates : initialCandidates,
    );

    let errorMessage: string | undefined;
    let id: string | undefined;
    try {
      const jwt = await currentUser.createAuthToken({ scope: '*' });
      const { e2eEncrypt, e2eEncryptMany } = currentUser;

      ({ errorMessage, id } = await createBallot({
        candidateTitles: uniqueCandidates,
        category: BALLOT_CATEGORY,
        e2eEncrypt,
        e2eEncryptMany,
        jwt,
        maxSelections,
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
      id: id!,
      nominationsEndAt: null,
      office: null,
      question: strippedQuestion,
      userId: currentUser.id,
      votingEndsAt: votingEnd,
    };
    cacheBallotPreview(ballotPreview);

    navigation.navigate('BallotPreviews', {
      prependedBallotId: ballotPreview.id,
    });
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
          placeholder="Which of these should we..."
          style={styles.multilineTextInput}
          returnKeyType="done"
          value={question}
        />
        <HeaderText>Choices</HeaderText>
        <NewCandidatesControl
          candidates={candidates}
          setCandidates={setCandidates}
        />
        <HeaderText>Max Selections</HeaderText>
        <StepperControl
          max={Math.max(1, candidates.filter((c) => c.length).length)}
          min={1}
          setValue={setMaxSelections}
          style={styles.stepperControl}
          value={maxSelections}
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
