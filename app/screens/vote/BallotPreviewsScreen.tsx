import React from 'react';
import { StyleSheet } from 'react-native';
import {
  BallotPreviewList, PrimaryButton, ScreenBackground,
} from '../../components';
import useTheme from '../../Theme';
import type { BallotPreviewsScreenProps } from '../../navigation';

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
  const prependedBallotIds = route.params?.prependedBallotIds;
  const { styles } = useStyles();
  return (
    <ScreenBackground>
      <BallotPreviewList
        contentContainerStyle={styles.contentContainerStyle}
        onItemPress={({ id, nominationsEndAt, votingEndsAt }) => {
          const now = new Date().getTime();
          const inNominations = now < (nominationsEndAt?.getTime() ?? 0);
          const active = now < votingEndsAt.getTime();
          let screenName: 'Ballot' | 'Nomination' | 'Result';
          if (active) {
            screenName = inNominations ? 'Nomination' : 'Ballot';
          } else {
            screenName = 'Result';
          }
          navigation.navigate(screenName, { ballotId: id });
        }}
        prependedBallotIds={prependedBallotIds}
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
