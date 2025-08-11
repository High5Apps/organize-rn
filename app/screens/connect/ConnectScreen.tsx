import React, { useCallback } from 'react';
import { Share, StyleSheet, Text } from 'react-native';
import {
  LockingScrollView, PrimaryButton, QRCodeControl, ScreenBackground,
  useHeaderButton,
} from '../../components';
import type { ConnectScreenProps } from '../../navigation';
import useTheme from '../../Theme';
import { appStoreURI } from '../../networking';
import { useTranslation } from '../../i18n';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

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
    prompt: {
      color: colors.label,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.body,
      marginTop: spacing.m,
      textAlign: 'center',
    },
    scrollView: {
      padding: spacing.m,
    },
  });

  return { styles };
};

export default function ConnectScreen({ navigation }: ConnectScreenProps) {
  useHeaderButton({
    iconName: 'qr-code-scanner',
    left: true,
    navigation,
    onPress: useCallback(
      () => navigation.navigate('NewConnection'),
      [navigation],
    ),
  });

  useHeaderButton({
    iconName: 'badge',
    navigation,
    onPress: useCallback(() => navigation.navigate('UnionCard'), [navigation]),
  });

  const { styles } = useStyles();
  const { t } = useTranslation();

  return (
    <ScreenBackground>
      <LockingScrollView
        contentContainerStyle={styles.contentContainerStyle}
        style={styles.scrollView}
      >
        <QRCodeControl />
        <Text style={styles.prompt}>{t('hint.shareToRecruit')}</Text>
      </LockingScrollView>
      <PrimaryButton
        iconName="share"
        label={t('action.shareApp')}
        onPress={() => Share.share({
          message: t('explanation.joinOrg', { appStoreURI: appStoreURI() }),
        })}
        style={styles.button}
      />
    </ScreenBackground>
  );
}
