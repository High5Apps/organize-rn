import React, { PropsWithChildren } from 'react';
import {
  Pressable, PressableStateCallbackType, StyleSheet, useColorScheme, ViewStyle,
} from 'react-native';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors, spacing } = useTheme();

  const isDarkMode = useColorScheme() === 'dark';

  const styles = StyleSheet.create({
    pressable: {
      alignItems: 'center',
      aspectRatio: 1,
      backgroundColor: colors.fill,
      borderColor: colors.primary,
      borderWidth: spacing.s,
      elevation: 4, // Android only
      justifyContent: 'center',
      shadowOffset: { // iOS only
        height: 2,
        width: 0,
      },
      shadowOpacity: 0.5, // iOS only
      shadowRadius: 4, // iOS only
    },
    pressed: {
      elevation: 1,
      opacity: isDarkMode ? 0.5 : 1,
      shadowOffset: {
        height: 1,
        width: 0,
      },
      shadowRadius: 1,
    },
  });
  return { isDarkMode, styles };
};

type Props = {
  disabled?: boolean;
  onPress?: () => void;
  showPressedInLightMode?: boolean;
  style?: ViewStyle;
};

export default function FrameButton(props: PropsWithChildren<Props>) {
  const {
    children, disabled, onPress, showPressedInLightMode, style,
  } = props;

  const { isDarkMode, styles } = useStyles();
  function shouldShowPressed({ pressed }: PressableStateCallbackType) {
    return (showPressedInLightMode && !isDarkMode) || pressed;
  }

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pressable,
        shouldShowPressed({ pressed }) && styles.pressed,
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

FrameButton.defaultProps = {
  disabled: false,
  onPress: () => {},
  showPressedInLightMode: false,
  style: {},
};
