import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  DateTimeSelector, HeaderText, KeyboardAvoidingScreenBackground,
  MultilineTextInput, NewCandidatesControl, PrimaryButton, StepperControl,
  startOfNextHourIn, useRequestProgress,
} from '../../components';
import { useBallotPreview, useCachedValue } from '../../model';
import useTheme from '../../Theme';
import type { NewMultipleChoiceBallotScreenProps } from '../../navigation';
import { useTranslation } from '../../i18n';

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

  const { createBallotPreview } = useBallotPreview();

  const { styles } = useStyles();
  const { t } = useTranslation();

  const {
    loading, RequestProgress, setLoading, setResult,
  } = useRequestProgress({ removeWhenInactive: true });

  const resetForm = () => {
    setCandidates(initialCandidates);
    setQuestion('');
    setVotingEnd(startOfNextHourIn({ days: 7 }));
    setResult('none');
  };

  const onPublishPressed = async () => {
    setLoading(true);
    setResult('none');

    try {
      const ballotPreview = await createBallotPreview({
        candidateTitles: candidates,
        maxSelections,
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
      <HeaderText>{t('object.question')}</HeaderText>
      <MultilineTextInput
        editable={!loading}
        enablesReturnKeyAutomatically
        maxLength={MAX_QUESTION_LENGTH}
        onChangeText={setQuestion}
        placeholder={t('placeholder.question.multipleChoice')}
        style={styles.multilineTextInput}
        submitBehavior="blurAndSubmit"
        returnKeyType="done"
        value={question}
      />
      <HeaderText>{t('object.choice', { count: 100 })}</HeaderText>
      <NewCandidatesControl
        candidates={candidates}
        disabled={loading}
        setCandidates={setCandidates}
      />
      <HeaderText>{t('object.maximum.selections')}</HeaderText>
      <StepperControl
        disabled={loading}
        max={Math.max(1, candidates.filter((c) => c.length).length)}
        min={1}
        setValue={setMaxSelections}
        style={styles.stepperControl}
        value={maxSelections}
      />
      <HeaderText>{t('object.date.votingEnd')}</HeaderText>
      <DateTimeSelector
        dateTime={votingEnd}
        disabled={loading}
        setDateTime={setVotingEnd}
        style={styles.dateTimeSelector}
      />
      <RequestProgress />
      <PrimaryButton
        iconName="publish"
        label={t('action.publish')}
        onPress={onPublishPressed}
        style={styles.button}
      />
    </KeyboardAvoidingScreenBackground>
  );
}
