import React, { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useIsFocused } from '@react-navigation/native';
import ScreenBackground from './ScreenBackground';
import useTheme from '../../Theme';

const useStyles = () => {
  const styles = StyleSheet.create({
    keyboardAwareScrollView: {
      flex: 1,
    },
  });

  return { styles };
};

type Props = {
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export default function KeyboardAvoidingScreenBackground({
  children, contentContainerStyle,
}: PropsWithChildren<Props>) {
  const { styles } = useStyles();
  const { spacing } = useTheme();

  // Workaround for https://github.com/facebook/react-native/issues/49694
  const isFocused = useIsFocused();

  return (
    <ScreenBackground>
      <KeyboardAwareScrollView
        alwaysBounceVertical={false}
        bottomOffset={spacing.m}
        contentContainerStyle={contentContainerStyle}
        enabled={isFocused}
        keyboardShouldPersistTaps="handled"
        style={styles.keyboardAwareScrollView}
      >
        {children}
      </KeyboardAwareScrollView>
    </ScreenBackground>
  );
}
