import React, { PropsWithChildren } from 'react';
import {
  Pressable, PressableStateCallbackType, StyleProp, StyleSheet, ViewStyle,
} from 'react-native';
import useTheme from '../../../Theme';

const useStyles = () => {
  const {
    colors, isDarkMode, opacity, shadows, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    deemphasized: {
      borderColor: colors.labelSecondary,
    },
    pressable: {
      alignItems: 'center',
      aspectRatio: 1,
      backgroundColor: colors.fill,
      borderColor: colors.primary,
      borderWidth: spacing.s,
      justifyContent: 'center',
      ...shadows.elevation4,
    },
    pressed: {
      opacity: isDarkMode ? opacity.hidden : opacity.visible,
      ...shadows.elevation1,
    },
  });
  return { isDarkMode, styles };
};

type Size = {
  height: number;
  width: number;
};

type Props = {
  deemphasizeWhenDisabled?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  onContainerSizeChange?: ({ height, width }: Size) => void;
  showPressedInLightMode?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function FrameButton(props: PropsWithChildren<Props>) {
  const {
    children, deemphasizeWhenDisabled, disabled, onContainerSizeChange, onPress,
    showPressedInLightMode, style,
  } = props;

  const { isDarkMode, styles } = useStyles();
  function shouldShowPressed({ pressed }: PressableStateCallbackType) {
    return (showPressedInLightMode && !isDarkMode) || pressed;
  }

  return (
    <Pressable
      disabled={disabled}
      onLayout={(event) => {
        let { height, width } = event.nativeEvent.layout;
        height -= 2 * styles.pressable.borderWidth;
        width -= 2 * styles.pressable.borderWidth;
        onContainerSizeChange?.({ height, width });
      }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pressable,
        shouldShowPressed({ pressed }) && styles.pressed,
        deemphasizeWhenDisabled && disabled && styles.deemphasized,
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

FrameButton.defaultProps = {
  deemphasizeWhenDisabled: false,
  disabled: false,
  onContainerSizeChange: () => {},
  onPress: () => {},
  showPressedInLightMode: false,
  style: {},
};
