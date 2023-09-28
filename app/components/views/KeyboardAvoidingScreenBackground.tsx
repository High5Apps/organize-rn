import React, { PropsWithChildren, useEffect, useState } from 'react';
import {
  Keyboard, KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import ScreenBackground from './ScreenBackground';

function useKeyboardVisibility() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return keyboardVisible;
}

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
  const keyboardVisible = useKeyboardVisibility();

  // Without this, the onPress prevents scroll gestures on deeper components
  const onPress = keyboardVisible ? Keyboard.dismiss : undefined;

  return (
    <ScreenBackground onPress={onPress}>
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
