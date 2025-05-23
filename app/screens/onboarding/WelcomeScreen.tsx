import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { CircleLogo } from '../../../assets';
import {
  AutoscaledText, ButtonRow, LockingAwareScrollView, PrimaryButton,
  ScreenBackground, SecondaryButton,
} from '../../components';
import { useTranslation } from '../../i18n';
import type { WelcomeScreenProps } from '../../navigation';
import useTheme from '../../Theme';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    button: {
      height: sizes.buttonHeight,
      marginHorizontal: spacing.s,
      flex: 1,
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
  const { t } = useTranslation();

  return (
    <ScreenBackground>
      <LockingAwareScrollView
        onScrollEnabledChanged={setButtonRowElevated}
        style={styles.scrollView}
      >
        <CircleLogo />
        <AutoscaledText style={styles.title}>
          {t('branding.appName')}
        </AutoscaledText>
        <AutoscaledText style={styles.subtitle}>
          {t('valueProposition')}
        </AutoscaledText>
      </LockingAwareScrollView>
      <ButtonRow elevated={buttonRowElevated}>
        <SecondaryButton
          iconName="add"
          label={t('action.createOrg')}
          onPress={() => navigation.navigate('NewOrg', { step: 0 })}
          style={styles.button}
        />
        <PrimaryButton
          iconName="qr-code-2"
          label={t('action.joinOrg')}
          onPress={() => navigation.navigate('JoinOrg')}
          style={styles.button}
        />
      </ButtonRow>
    </ScreenBackground>
  );
}
