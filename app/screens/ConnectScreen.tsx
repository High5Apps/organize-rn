import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { QRCodeControl, ScreenBackground } from '../components';
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
      flexGrow: 1,
      padding: spacing.m,
    },
  });

  return { styles };
};

export default function ConnectScreen() {
  const { styles } = useStyles();

  return (
    <ScreenBackground>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
      >
        <QRCodeControl />
        <Text style={styles.prompt}>
          Recruit or connect with members by letting them scan your secret code.
        </Text>
      </ScrollView>
    </ScreenBackground>
  );
}
