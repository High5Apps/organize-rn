import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import {
  ButtonRow, IconButton, LockingScrollView, PrimaryButton, QRCodeControl,
  ScreenBackground,
} from '../components';
import type { ConnectScreenProps, SettingsScreenNavigationProp } from '../navigation';
import useTheme from '../Theme';

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
    settingsButton: {
      marginEnd: spacing.m,
    },
  });

  return { styles };
};

function SettingsButton() {
  const navigation: SettingsScreenNavigationProp = useNavigation();
  const { styles } = useStyles();
  return (
    <IconButton
      iconName="settings"
      onPress={() => navigation.navigate('Settings')}
      style={styles.settingsButton}
    />
  );
}

export default function ConnectScreen({ navigation }: ConnectScreenProps) {
  const { styles } = useStyles();

  const headerRight = () => <SettingsButton />;

  useLayoutEffect(() => {
    navigation.setOptions({ headerRight });
  }, [navigation]);

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
