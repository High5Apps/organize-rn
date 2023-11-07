import React from 'react';
import { StyleSheet } from 'react-native';
import { PrimaryButton, ScreenBackground } from '../components';
import useTheme from '../Theme';

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

export default function VoteScreen() {
  const { styles } = useStyles();
  return (
    <ScreenBackground>
      <PrimaryButton
        iconName="add"
        label="New Vote"
        onPress={() => console.log('press')}
        style={styles.button}
      />
    </ScreenBackground>
  );
}
