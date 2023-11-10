import React, { PropsWithChildren, useEffect, useState } from 'react';
import {
  Keyboard, KeyboardAvoidingView, StyleProp, StyleSheet, ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

type Props = {
  style?: StyleProp<ViewStyle>;
  topNavigationBarHidden?: boolean;
};

export default function KeyboardAvoidingScreenBackground({
  children, style, topNavigationBarHidden,
}: PropsWithChildren<Props>) {
  const { styles } = useStyles();

  const headerHeight = useHeaderHeight();
  const { top: topPadding } = useSafeAreaInsets();
  const keyboardVerticalOffset = topNavigationBarHidden
    ? topPadding + headerHeight : headerHeight;

  const keyboardVisible = useKeyboardVisibility();

  // Without this, the onPress prevents scroll gestures on deeper components
  const onPress = keyboardVisible ? Keyboard.dismiss : undefined;

  return (
    <ScreenBackground onPress={onPress}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={[styles.keyboardAvoidingView, style]}
      >
        {children}
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

KeyboardAvoidingScreenBackground.defaultProps = {
  style: {},
  topNavigationBarHidden: false,
};
