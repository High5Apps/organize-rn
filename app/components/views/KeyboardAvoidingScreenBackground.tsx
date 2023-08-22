import React, { PropsWithChildren } from 'react';
import {
  Keyboard, KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import ScreenBackground from './ScreenBackground';

const useStyles = () => {
  const styles = StyleSheet.create({
    keyboardAvoidingView: {
      flex: 1,
    },
  });

  return { styles };
};

export default function KeyboardAvoidingScreenBackground({
  children,
}: PropsWithChildren<{}>) {
  const { styles } = useStyles();
  const headerHeight = useHeaderHeight();

  return (
    <ScreenBackground onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        // Setting behavior to anything besides undefined caused weird issues on
        // Android. Fortunately, it seems to work fine with undefined.
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={headerHeight}
        style={styles.keyboardAvoidingView}
      >
        {children}
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}
