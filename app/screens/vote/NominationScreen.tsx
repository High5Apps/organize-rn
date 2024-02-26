import React, { useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import type { NominationScreenProps } from '../../navigation';
import { OfficeCategory, addMetadata, useBallotPreviews } from '../../model';
import useTheme from '../../Theme';
import {
  ButtonRow, PrimaryButton, ScreenBackground, SecondaryButton,
  useLearnMoreOfficeModal,
} from '../../components';

function useTitleUpdater(
  navigation: NominationScreenProps['navigation'],
  officeCategory: OfficeCategory,
) {
  useLayoutEffect(() => {
    const office = addMetadata({ type: officeCategory, open: true });
    const title = `Nominations for ${office.title}`;
    navigation.setOptions({ title });
  }, [navigation, officeCategory]);
}

const useStyles = () => {
  const { sizes, spacing } = useTheme();

  const buttonMargin = spacing.m;
  const buttonBoundingBoxHeight = 2 * buttonMargin + sizes.buttonHeight;

  const styles = StyleSheet.create({
    button: {
      flex: 0,
      height: sizes.buttonHeight,
      marginHorizontal: buttonMargin,
      paddingHorizontal: buttonMargin,
    },
    buttonRow: {
      bottom: 0,
      position: 'absolute',
    },
    contentContainerStyle: {
      paddingBottom: buttonBoundingBoxHeight,
    },
  });

  return { styles };
};

export default function NominationScreen({
  navigation, route,
}: NominationScreenProps) {
  const { ballotId } = route.params;

  const { styles } = useStyles();

  const { getCachedBallotPreview } = useBallotPreviews();
  const ballotPreview = getCachedBallotPreview(ballotId);
  if (!ballotPreview || ballotPreview.category !== 'election') {
    throw new Error('Expected ballotPreview to be defined and an election');
  }

  useTitleUpdater(navigation, ballotPreview.office);

  const {
    LearnMoreOfficeModal, setModalVisible,
  } = useLearnMoreOfficeModal({ officeCategory: ballotPreview.office });

  return (
    <ScreenBackground>
      <LearnMoreOfficeModal />
      <ButtonRow style={styles.buttonRow}>
        <SecondaryButton
          iconName="info-outline"
          label="Learn more"
          onPress={() => setModalVisible(true)}
          style={styles.button}
        />
        <PrimaryButton
          iconName="record-voice-over"
          label="Nominate"
          onPress={() => navigation.navigate('NewNomination')}
          style={styles.button}
        />
      </ButtonRow>
    </ScreenBackground>
  );
}
