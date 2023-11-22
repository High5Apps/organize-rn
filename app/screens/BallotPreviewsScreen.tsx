import React from 'react';
import { StyleSheet } from 'react-native';
import {
  BallotPreviewList, PrimaryButton, ScreenBackground,
} from '../components';
import useTheme from '../Theme';
import type { BallotPreviewsScreenProps } from '../navigation';

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
        onItemPress={({ id, votingEndsAt }) => {
          const active = votingEndsAt.getTime() > new Date().getTime();
          if (active) {
            navigation.navigate('Ballot', { ballotId: id });
          } else {
            console.log('TODO: Navigate to results');
          }
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
