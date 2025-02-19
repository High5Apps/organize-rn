import React, { useState } from 'react';
import { Share, StyleSheet, Text } from 'react-native';
import {
  ButtonRow, LockingAwareScrollView, PrimaryButton, QRCodeControl,
  ScreenBackground, SecondaryButton,
} from '../../components';
import type { ConnectScreenProps } from '../../navigation';
import useTheme from '../../Theme';
import { appStoreURI } from '../../networking';

const SHARE_MESSAGE = `To join our Org:
1. Get the Organize app at ${appStoreURI()}
2. Meet me in person to scan my membership code`;

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

  const { styles } = useStyles();

  return (
    <ScreenBackground>
      <LockingAwareScrollView
        onScrollEnabledChanged={setButtonRowElevated}
        style={styles.scrollView}
      >
        <QRCodeControl />
        <Text style={styles.prompt}>
          Recruit or connect with members by letting them scan your secret code.
        </Text>
      </LockingAwareScrollView>
      <ButtonRow elevated={buttonRowElevated} style={styles.buttonRow}>
        <SecondaryButton
          iconName="qr-code-scanner"
          label="Scan"
          onPress={() => navigation.navigate('NewConnection')}
          style={styles.button}
        />
        <PrimaryButton
          iconName="share"
          label="Share the app"
          onPress={() => Share.share({ message: SHARE_MESSAGE })}
          style={styles.button}
        />
      </ButtonRow>
    </ScreenBackground>
  );
}
