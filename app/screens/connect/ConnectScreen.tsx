import React from 'react';
import { StyleSheet, Text } from 'react-native';
import {
  ButtonRow, LockingScrollView, PrimaryButton, QRCodeControl, ScreenBackground,
} from '../../components';
import type { ConnectScreenProps } from '../../navigation';
import useTheme from '../../Theme';

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
      flexDirection: 'row-reverse',
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
  const { styles } = useStyles();

  return (
    <ScreenBackground>
      <LockingScrollView style={styles.scrollView}>
        <QRCodeControl />
        <Text style={styles.prompt}>
          Recruit or connect with members by letting them scan your secret code.
        </Text>
      </LockingScrollView>
      <ButtonRow elevated={false} style={styles.buttonRow}>
        <PrimaryButton
          iconName="qr-code-scanner"
          label="Scan"
          onPress={() => navigation.navigate('NewConnection')}
          style={styles.button}
        />
      </ButtonRow>
    </ScreenBackground>
  );
}
