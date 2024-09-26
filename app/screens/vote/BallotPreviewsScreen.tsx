import React, { useCallback } from 'react';
import { Linking, StyleSheet } from 'react-native';
import {
  BallotPreviewList, PrimaryButton, ScreenBackground,
} from '../../components';
import useTheme from '../../Theme';
import type { BallotPreviewsScreenProps } from '../../navigation';
import { appStoreURI, BallotPreview } from '../../model';

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

export default function VoteScreen({
  navigation, route,
}: BallotPreviewsScreenProps) {
  const prependedBallotId = route.params?.prependedBallotId;
  const { styles } = useStyles();

  const onItemPress = useCallback(({
    category, id, nominationsEndAt, votingEndsAt,
  }: BallotPreview) => {
    if (category === 'unknown') {
      Linking.openURL(appStoreURI({ ref: 'ballot-preview-row' }));
      return;
    }

    const now = new Date().getTime();
    const inNominations = now < (nominationsEndAt?.getTime() ?? 0);
    const active = now < votingEndsAt.getTime();
    let screenName: 'Ballot' | 'Nominations' | 'Result';
    if (active) {
      screenName = inNominations ? 'Nominations' : 'Ballot';
    } else {
      screenName = 'Result';
    }
    navigation.navigate(screenName, { ballotId: id });
  }, [navigation]);

  return (
    <ScreenBackground>
      <BallotPreviewList
        contentContainerStyle={styles.contentContainerStyle}
        onItemPress={onItemPress}
        prependedBallotId={prependedBallotId}
      />
      <PrimaryButton
        iconName="add"
        label="New Vote"
        onPress={() => navigation.navigate('BallotType')}
        style={styles.button}
      />
    </ScreenBackground>
  );
}
