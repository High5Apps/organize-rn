import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, useWindowDimensions, View,
} from 'react-native';
import { CircleLogo } from '../../assets';
import {
  AutoscaledText, PrimaryButton, ScreenBackground, SecondaryButton,
} from '../components';
import { NewOrgStepNavigator, WelcomeScreenProps } from '../navigation';
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
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.s,
      paddingVertical: spacing.m,
    },
    buttonRowScrollEnabled: {
      backgroundColor: colors.background,
      borderTopColor: colors.separator,
      borderTopWidth: sizes.separator,
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
      <View
        style={[
          styles.buttonRow,
          scrollEnabled && styles.buttonRowScrollEnabled,
        ]}
      >
        <SecondaryButton
          iconName="add"
          label="Create Org"
          onPress={() => NewOrgStepNavigator(navigation).navigateToStep(0)}
          style={styles.button}
        />
        <PrimaryButton
          iconName="qr-code-2"
          label="Join Org"
          onPress={() => console.log('Join pressed!')}
          style={styles.button}
        />
      </View>
    </ScreenBackground>
  );
}
