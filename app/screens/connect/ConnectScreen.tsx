import React, { useCallback, useState } from 'react';
import { Share, StyleSheet, Text } from 'react-native';
import {
  ButtonRow, LockingAwareScrollView, PrimaryButton, QRCodeControl,
  ScreenBackground, SecondaryButton, useHeaderButton,
} from '../../components';
import type { ConnectScreenProps } from '../../navigation';
import useTheme from '../../Theme';
import { appStoreURI } from '../../networking';
import { useTranslation } from '../../i18n';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    button: {
      flex: 0,
      height: sizes.buttonHeight,
      paddingHorizontal: spacing.m,
      marginHorizontal: spacing.s,
    },
    buttonRow: {
      justifyContent: 'space-between',
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
  const [buttonRowElevated, setButtonRowElevated] = useState(false);

  useHeaderButton({
    iconName: 'badge',
    navigation,
    onPress: useCallback(() => navigation.navigate('UnionCard'), [navigation]),
  });

  const { styles } = useStyles();
  const { t } = useTranslation();

  return (
    <ScreenBackground>
      <LockingAwareScrollView
        onScrollEnabledChanged={setButtonRowElevated}
        style={styles.scrollView}
      >
        <QRCodeControl />
        <Text style={styles.prompt}>{t('hint.shareToRecruit')}</Text>
      </LockingAwareScrollView>
      <ButtonRow elevated={buttonRowElevated} style={styles.buttonRow}>
        <SecondaryButton
          iconName="qr-code-scanner"
          label={t('action.scan')}
          onPress={() => navigation.navigate('NewConnection')}
          style={styles.button}
        />
        <PrimaryButton
          iconName="share"
          label={t('action.shareApp')}
          onPress={() => Share.share({
            message: t('explanation.joinOrg', { appStoreURI }),
          })}
          style={styles.button}
        />
      </ButtonRow>
    </ScreenBackground>
  );
}
