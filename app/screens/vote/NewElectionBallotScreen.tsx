import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import type { NewElectionBallotScreenProps } from '../../navigation';
import {
  DateTimeSelector, HeaderText, LockingScrollView, OfficeRow, PrimaryButton,
  ScreenBackground, StepperControl, startOfNextHourIn, useLearnMoreOfficeModal,
  useRequestProgress,
} from '../../components';
import useTheme from '../../Theme';
import { useBallotPreview } from '../../model';
import { useTranslation } from '../../i18n';

const BALLOT_CATEGORY = 'election';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const containerPaddingHorizontal = spacing.m;

  const styles = StyleSheet.create({
    button: {
      alignSelf: 'flex-end',
      flex: 0,
      height: sizes.buttonHeight,
      paddingHorizontal: spacing.m,
    },
    container: {
      padding: containerPaddingHorizontal,
      rowGap: spacing.s,
    },
    dateTimeSelector: {
      marginStart: spacing.m,
    },
    officeRow: {
      marginEnd: -1 * containerPaddingHorizontal,
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
  const [termEnd, setTermEnd] = useState(startOfNextHourIn({ days: 21 + 365 }));
  const [termStart, setTermStart] = useState(startOfNextHourIn({ days: 21 }));

  const { createBallotPreview } = useBallotPreview();

  const { styles } = useStyles();
  const { t } = useTranslation();

  const {
    LearnMoreOfficeModal, office, setModalVisible,
  } = useLearnMoreOfficeModal({ officeCategory });

  const {
    loading, RequestProgress, setLoading, setResult,
  } = useRequestProgress({ removeWhenInactive: true });

  if (!office) { return null; }

  const question = t('placeholder.question.election', { office: office.title });

  const resetForm = () => {
    setNominationsEnd(startOfNextHourIn({ days: 7 }));
    setVotingEnd(startOfNextHourIn({ days: 14 }));
    setTermEnd(startOfNextHourIn({ days: 14 + 365 }));
    setResult('none');
  };

  const onPublishPressed = async () => {
    setLoading(true);
    setResult('none');

    try {
      const ballotPreview = await createBallotPreview({
        maxSelections,
        partialBallotPreview: {
          category: BALLOT_CATEGORY,
          nominationsEndAt: nominationsEnd,
          office: officeCategory,
          question,
          votingEndsAt: votingEnd,
        },
        termEndsAt: termEnd,
        termStartsAt: termStart,
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
    <ScreenBackground>
      <LearnMoreOfficeModal />
      <LockingScrollView
        contentContainerStyle={styles.container}
        style={styles.scrollView}
      >
        <HeaderText>{t('object.question')}</HeaderText>
        <Text style={styles.text}>{question}</Text>
        <HeaderText>{t('object.office')}</HeaderText>
        <OfficeRow
          item={office}
          onPress={() => setModalVisible(true)}
          style={styles.officeRow}
          textButtonLabel={t('action.learnMore')}
        />
        {officeCategory === 'steward' && (
          <>
            <HeaderText>{t('object.maximum.winners')}</HeaderText>
            <StepperControl
              disabled={loading}
              min={1}
              setValue={setMaxSelections}
              style={styles.stepperControl}
              value={maxSelections}
            />
          </>
        )}
        <HeaderText>{t('object.date.nominationsEnd')}</HeaderText>
        <DateTimeSelector
          dateTime={nominationsEnd}
          disabled={loading}
          setDateTime={setNominationsEnd}
          style={styles.dateTimeSelector}
        />
        <HeaderText>{t('object.date.votingEnd')}</HeaderText>
        <DateTimeSelector
          dateTime={votingEnd}
          disabled={loading}
          setDateTime={setVotingEnd}
          style={styles.dateTimeSelector}
        />
        <HeaderText>{t('object.date.termStart')}</HeaderText>
        <DateTimeSelector
          dateTime={termStart}
          disabled={loading}
          setDateTime={setTermStart}
          style={styles.dateTimeSelector}
        />
        <HeaderText>{t('object.date.termEnd')}</HeaderText>
        <DateTimeSelector
          dateTime={termEnd}
          disabled={loading}
          setDateTime={setTermEnd}
          style={styles.dateTimeSelector}
        />
        <RequestProgress />
        <PrimaryButton
          iconName="publish"
          label={t('action.publish')}
          onPress={onPublishPressed}
          style={styles.button}
        />
      </LockingScrollView>
    </ScreenBackground>
  );
}
