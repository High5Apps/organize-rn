import React, { useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { CircleLogo } from '../../assets';
import {
  AutoscaledText, ButtonRow, PrimaryButton, ScreenBackground, SecondaryButton,
} from '../components';
import { WelcomeScreenProps } from '../navigation';
import useTheme from '../Theme';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();
  const { buttonHeight } = sizes;

  const buttonRowHeight = buttonHeight + 4 * spacing.m;

  const styles = StyleSheet.create({
    button: {
      height: buttonHeight,
      marginHorizontal: spacing.s,
    },
    scrollView: {
      flexGrow: 1,
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

  return { buttonRowHeight, styles };
};

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const { height: screenHeight } = useWindowDimensions();
  const { buttonRowHeight, styles } = useStyles();

  const onContentSizeChange = (_: number, contentHeight: number) => {
    setScrollEnabled(contentHeight > screenHeight - buttonRowHeight);
  };

  return (
    <ScreenBackground>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        onContentSizeChange={onContentSizeChange}
        style={styles.scrollView}
        scrollEnabled={scrollEnabled}
      >
        <CircleLogo />
        <AutoscaledText style={styles.title}>
          Organize
        </AutoscaledText>
        <AutoscaledText style={styles.subtitle}>
          Strength in Numbers
        </AutoscaledText>
      </ScrollView>
      <ButtonRow elevated={scrollEnabled}>
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