import React, { useCallback, useLayoutEffect } from 'react';
import { StyleSheet } from 'react-native';
import type { NominationScreenProps } from '../../navigation';
import { OfficeCategory, getOffice, useBallotPreviews } from '../../model';
import useTheme from '../../Theme';
import {
  NominationList, PrimaryButton, ScreenBackground, useAnnounceButton,
  useDiscussButton, useHeaderButton, useLearnMoreOfficeModal,
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
      bottom: buttonMargin,
      end: buttonMargin,
      height: sizes.buttonHeight,
      paddingHorizontal: buttonMargin,
      position: 'absolute',
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
  useHeaderButton({
    iconName: 'help-outline',
    navigation,
    onPress: useCallback(() => setModalVisible(true), []),
  });

  const DiscussButton = useDiscussButton(navigation);
  const AnnounceButton = useAnnounceButton(navigation, ballotId);

  return (
    <ScreenBackground>
      <NominationList
        AnnounceButton={AnnounceButton}
        ballotId={ballotId}
        contentContainerStyle={styles.contentContainerStyle}
        DiscussButton={DiscussButton}
      />
      <LearnMoreOfficeModal />
      <PrimaryButton
        iconName="record-voice-over"
        label="Nominate"
        onPress={() => navigation.navigate('NewNomination', { ballotId })}
        style={styles.button}
      />
    </ScreenBackground>
  );
}
