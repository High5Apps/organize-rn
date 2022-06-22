import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { CircleLogo } from '../../assets';
import {
  AutoscaledText, ButtonRow, LockingScrollView, PrimaryButton, ScreenBackground,
  SecondaryButton,
} from '../components';
import type { WelcomeScreenProps } from '../navigation';
import useTheme from '../Theme';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    button: {
      height: sizes.buttonHeight,
      marginHorizontal: spacing.s,
    },
    scrollView: {
      marginTop: spacing.m,
      paddingHorizontal: spacing.m,
    },
    subtitle: {
      color: colors.labelSecondary,
      fontFamily: font.weights.regular,
    },
    title: {
      color: colors.label,
      fontFamily: font.weights.medium,
    },
  });

  return { styles };
};

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const [buttonRowElevated, setButtonRowElevated] = useState(false);
  const { styles } = useStyles();

  return (
    <ScreenBackground>
      <LockingScrollView
        onScrollEnabledChanged={setButtonRowElevated}
        style={styles.scrollView}
      >
        <CircleLogo />
        <AutoscaledText style={styles.title}>
          Organize
        </AutoscaledText>
        <AutoscaledText style={styles.subtitle}>
          Strength in Numbers
        </AutoscaledText>
      </LockingScrollView>
      <ButtonRow elevated={buttonRowElevated}>
        <SecondaryButton
          iconName="add"
          label="Create Org"
          onPress={() => navigation.navigate('NewOrg', { step: 0 })}
          style={styles.button}
        />
        <PrimaryButton
          iconName="qr-code-2"
          label="Join Org"
          onPress={() => navigation.navigate('JoinOrg')}
          style={styles.button}
        />
      </ButtonRow>
    </ScreenBackground>
  );
}
