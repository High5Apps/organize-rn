import React from 'react';
import { StyleSheet } from 'react-native';
import { BallotList, PrimaryButton, ScreenBackground } from '../components';
import useTheme from '../Theme';
import type { BallotsScreenProps } from '../navigation';

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

export default function VoteScreen({ navigation }: BallotsScreenProps) {
  const { styles } = useStyles();
  return (
    <ScreenBackground>
      <BallotList
        contentContainerStyle={styles.contentContainerStyle}
        onItemPress={console.log}
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
