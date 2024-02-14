import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import type { NewElectionBallotScreenProps } from '../../navigation';
import {
  BulletedText, DateTimeSelector, HeaderText, KeyboardAvoidingScreenBackground,
  OfficeRow, PrimaryButton, startOfNextHourIn,
} from '../../components';
import useTheme from '../../Theme';
import { OFFICE_DUTIES, addMetadata } from '../../model';
import LearnMoreModal from '../LearnMoreModal';

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
    scrollView: {
      flex: 1,
    },
  });

  return { styles };
};

export default function NewElectionBallotScreen({
  route,
}: NewElectionBallotScreenProps) {
  const { officeCategory } = route.params;
  const duties = OFFICE_DUTIES[officeCategory];
  const office = addMetadata({ type: officeCategory, open: true });

  const [modalVisible, setModalVisible] = useState(false);
  const [
    nominationsEnd, setNominationsEnd,
  ] = useState(startOfNextHourIn({ days: 7 }));
  const [votingEnd, setVotingEnd] = useState(startOfNextHourIn({ days: 14 }));
  const [termEnd, setTermEnd] = useState(startOfNextHourIn({ days: 14 + 365 }));

  const { styles } = useStyles();

  const onPublishPressed = () => {
    console.log({
      nominationsEnd, officeCategory, termEnd, votingEnd,
    });
  };

  return (
    <KeyboardAvoidingScreenBackground>
      <LearnMoreModal
        headline={`What does a ${office.title} do?`}
        iconName={office.iconName}
        setVisible={setModalVisible}
        visible={modalVisible}
      >
        <BulletedText bullets={duties} />
      </LearnMoreModal>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        style={styles.scrollView}
      >
        <HeaderText>Office</HeaderText>
        <OfficeRow
          item={office}
          onPress={() => setModalVisible(true)}
          textButtonLabel="Learn more"
        />
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
