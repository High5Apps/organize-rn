import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import type { NewElectionBallotScreenProps } from '../../navigation';
import {
  DateTimeSelector, HeaderText, KeyboardAvoidingScreenBackground, OfficeRow,
  PrimaryButton, StepperControl, startOfNextHourIn, useLearnMoreOfficeModal,
  useRequestProgress,
} from '../../components';
import useTheme from '../../Theme';
import {
  BallotPreview, GENERIC_ERROR_MESSAGE, useBallotPreviews, useUserContext,
} from '../../model';
import { createBallot } from '../../networking';

const BALLOT_CATEGORY = 'election';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

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
    scrollView: {
      flex: 1,
    },
    stepperControl: {
      marginStart: spacing.m,
    },
    text: {
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
      marginStart: spacing.m,
    },
  });

  return { styles };
};

export default function NewElectionBallotScreen({
  navigation, route,
}: NewElectionBallotScreenProps) {
  const { officeCategory } = route.params;

  const [maxSelections, setMaxSelections] = useState(1);
  const [
    nominationsEnd, setNominationsEnd,
  ] = useState(startOfNextHourIn({ days: 7 }));
  const [votingEnd, setVotingEnd] = useState(startOfNextHourIn({ days: 14 }));
  const [termEnd, setTermEnd] = useState(startOfNextHourIn({ days: 14 + 365 }));

  const { currentUser } = useUserContext();

  const { styles } = useStyles();

  const {
    LearnMoreOfficeModal, office, setModalVisible,
  } = useLearnMoreOfficeModal({ officeCategory });

  const {
    RequestProgress, setLoading, setResult,
  } = useRequestProgress({ removeWhenInactive: true });

  const { cacheBallotPreview } = useBallotPreviews();

  if (!office) { return null; }

  const question = `Who should we elect ${office.title}?`;

  const resetForm = () => {
    setNominationsEnd(startOfNextHourIn({ days: 7 }));
    setVotingEnd(startOfNextHourIn({ days: 14 }));
    setTermEnd(startOfNextHourIn({ days: 14 + 365 }));
    setResult('none');
  };

  const onPublishPressed = async () => {
    if (!currentUser) { return; }

    setLoading(true);
    setResult('none');

    let errorMessage: string | undefined;
    let id: string | undefined;
    try {
      const jwt = await currentUser.createAuthToken({ scope: '*' });
      const { e2eEncrypt, e2eEncryptMany } = currentUser;

      ({ errorMessage, id } = await createBallot({
        category: BALLOT_CATEGORY,
        e2eEncrypt,
        e2eEncryptMany,
        jwt,
        maxSelections,
        office: officeCategory,
        question,
        termEndsAt: termEnd,
        nominationsEndAt: nominationsEnd,
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
      nominationsEndAt: nominationsEnd,
      office: officeCategory,
      question,
      userId: currentUser.id,
      votingEndsAt: votingEnd,
    };
    cacheBallotPreview(ballotPreview);

    navigation.navigate('BallotPreviews', {
      prependedBallotIds: [ballotPreview.id],
    });
  };

  return (
    <KeyboardAvoidingScreenBackground>
      <LearnMoreOfficeModal />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        style={styles.scrollView}
      >
        <HeaderText>Question</HeaderText>
        <Text style={styles.text}>{question}</Text>
        <HeaderText>Office</HeaderText>
        <OfficeRow
          item={office}
          onPress={() => setModalVisible(true)}
          textButtonLabel="Learn more"
        />
        {officeCategory === 'steward' && (
          <>
            <HeaderText>Max Winners</HeaderText>
            <StepperControl
              min={1}
              setValue={setMaxSelections}
              style={styles.stepperControl}
              value={maxSelections}
            />
          </>
        )}
        <HeaderText>Nominations End On</HeaderText>
        <DateTimeSelector
          dateTime={nominationsEnd}
          setDateTime={setNominationsEnd}
          style={styles.dateTimeSelector}
        />
        <HeaderText>Voting Ends On</HeaderText>
        <DateTimeSelector
          dateTime={votingEnd}
          setDateTime={setVotingEnd}
          style={styles.dateTimeSelector}
        />
        <HeaderText>Term Ends On</HeaderText>
        <DateTimeSelector
          dateTime={termEnd}
          setDateTime={setTermEnd}
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
