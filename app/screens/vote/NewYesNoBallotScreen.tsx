import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  DateTimeSelector, HeaderText, KeyboardAvoidingScreenBackground,
  MultilineTextInput, PrimaryButton, startOfNextHourIn, useRequestProgress,
} from '../../components';
import { useBallotPreview, useCachedValue } from '../../model';
import useTheme from '../../Theme';
import type { NewYesNoBallotScreenProps } from '../../navigation';

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
      margin: spacing.m,
      rowGap: spacing.s,
    },
    dateTimeSelector: {
      marginStart: spacing.m,
    },
    multilineTextInput: {
      marginBottom: spacing.s,
      height: 100,
    },
  });

  return { styles };
};

export default function NewYesNoBallotScreen({
  navigation,
}: NewYesNoBallotScreenProps) {
  const [question, setQuestion] = useCachedValue<string>(CACHE_KEY_QUESTION);
  const [votingEnd, setVotingEnd] = useState(startOfNextHourIn({ days: 7 }));

  const { createBallotPreview } = useBallotPreview();

  const { styles } = useStyles();

  const {
    loading, RequestProgress, setLoading, setResult,
  } = useRequestProgress({ removeWhenInactive: true });

  const resetForm = () => {
    setQuestion('');
    setVotingEnd(startOfNextHourIn({ days: 7 }));
    setResult('none');
  };

  const onPublishPressed = async () => {
    setLoading(true);
    setResult('none');

    try {
      const ballotPreview = await createBallotPreview({
        candidateTitles: CANDIDATE_TITLES,
        partialBallotPreview: {
          category: BALLOT_CATEGORY,
          nominationsEndAt: null,
          office: null,
          question,
          votingEndsAt: votingEnd,
        },
      });
      resetForm();
      setResult('success');
      navigation.popTo('BallotPreviews', {
        prependedBallotId: ballotPreview.id,
      });
    } catch (error) {
      setResult('error', { error });
    }
  };

  return (
    <KeyboardAvoidingScreenBackground contentContainerStyle={styles.container}>
      <HeaderText>Question</HeaderText>
      <MultilineTextInput
        editable={!loading}
        enablesReturnKeyAutomatically
        maxLength={MAX_QUESTION_LENGTH}
        onChangeText={setQuestion}
        placeholder="Should we..."
        style={styles.multilineTextInput}
        submitBehavior="blurAndSubmit"
        returnKeyType="done"
        value={question}
      />
      <HeaderText>Voting Ends On</HeaderText>
      <DateTimeSelector
        dateTime={votingEnd}
        disabled={loading}
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
    </KeyboardAvoidingScreenBackground>
  );
}
