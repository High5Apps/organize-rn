import React, { PropsWithChildren } from 'react';
import {
  Pressable, PressableStateCallbackType, StyleProp, StyleSheet, ViewStyle,
} from 'react-native';
import useTheme from '../../Theme';

const useStyles = () => {
  const {
    colors, isDarkMode, shadows, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    pressable: {
      alignItems: 'center',
      aspectRatio: 1,
      backgroundColor: colors.fill,
      borderColor: colors.primary,
      borderWidth: spacing.s,
      justifyContent: 'center',
      overflow: 'hidden',
      ...shadows.elevation4,
    },
    pressed: {
      opacity: isDarkMode ? 0.5 : 1,
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
  disabled?: boolean;
  onPress?: () => void;
  onContainerSizeChange?: ({ height, width }: Size) => void;
  showPressedInLightMode?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function FrameButton(props: PropsWithChildren<Props>) {
  const {
    children, disabled, onContainerSizeChange, onPress, showPressedInLightMode,
    style,
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
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

FrameButton.defaultProps = {
  disabled: false,
  onContainerSizeChange: () => {},
  onPress: () => {},
  showPressedInLightMode: false,
  style: {},
};
