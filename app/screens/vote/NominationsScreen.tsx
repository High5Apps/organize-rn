import React, { useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import type { NominationScreenProps } from '../../navigation';
import { OfficeCategory, getOffice, useBallotPreviews } from '../../model';
import useTheme from '../../Theme';
import {
  ButtonRow, NominationList, PrimaryButton, ScreenBackground, SecondaryButton,
  useLearnMoreOfficeModal,
} from '../../components';

function useTitleUpdater(
  navigation: NominationScreenProps['navigation'],
  officeCategory: OfficeCategory,
) {
  useLayoutEffect(() => {
    const office = getOffice(officeCategory);
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
      paddingHorizontal: buttonMargin,
    },
    buttonRow: {
      bottom: 0,
      left: 0,
      paddingHorizontal: spacing.m,
      position: 'absolute',
      right: 0,
    },
    contentContainerStyle: {
      paddingBottom: buttonBoundingBoxHeight,
    },
  });

  return { styles };
};

export default function NominationsScreen({
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
      <NominationList
        ballotId={ballotId}
        contentContainerStyle={styles.contentContainerStyle}
      />
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
          onPress={() => navigation.navigate('NewNomination', { ballotId })}
          style={styles.button}
        />
      </ButtonRow>
    </ScreenBackground>
  );
}
