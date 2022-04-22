import React from 'react';
import { StyleSheet, Text } from 'react-native';
import {
  LockingScrollView, QRCodeControl, ScreenBackground,
} from '../components';
import useTheme from '../Theme';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
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

export default function ConnectScreen() {
  const { styles } = useStyles();

  return (
    <ScreenBackground>
      <LockingScrollView style={styles.scrollView}>
        <QRCodeControl />
        <Text style={styles.prompt}>
          Recruit or connect with members by letting them scan your secret code.
        </Text>
      </LockingScrollView>
    </ScreenBackground>
  );
}
