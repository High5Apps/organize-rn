import React from 'react';
import { StyleSheet } from 'react-native';
import { PrimaryButton, ScreenBackground } from '../components';
import useTheme from '../Theme';
import type { BallotsScreenProps } from '../navigation';

const useStyles = () => {
  const { sizes, spacing } = useTheme();

  const styles = StyleSheet.create({
    button: {
      bottom: spacing.m,
      end: spacing.m,
      height: sizes.buttonHeight,
      paddingHorizontal: spacing.m,
      position: 'absolute',
    },
  });

  return { styles };
};

export default function VoteScreen({ navigation }: BallotsScreenProps) {
  const { styles } = useStyles();
  return (
    <ScreenBackground>
      <PrimaryButton
        iconName="add"
        label="New Vote"
        onPress={() => navigation.navigate('BallotType')}
        style={styles.button}
      />
    </ScreenBackground>
  );
}
