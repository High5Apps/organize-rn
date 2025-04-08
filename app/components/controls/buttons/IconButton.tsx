import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../../Theme';

const useStyles = () => {
  const { colors, opacity, sizes } = useTheme();

  const styles = StyleSheet.create({
    disabled: {
      color: colors.labelSecondary,
    },
    pressed: {
      opacity: opacity.disabled,
    },
    icon: {
      color: colors.primary,
    },
    iconDefault: {
      fontSize: sizes.icon,
    },
    iconLarge: {
      fontSize: sizes.largeIcon,
    },
    iconMedium: {
      fontSize: sizes.mediumIcon,
    },
  });

  return { styles };
};

type IconSize = 'default' | 'large' | 'medium';

type Props = {
  disabled?: boolean;
  iconName: string;
  iconSize?: IconSize;
  onPress?: () => void;
  style?: ViewStyle,
};

export default function IconButton({
  disabled = false, iconName, iconSize = 'default', onPress = () => {},
  style = {},
}: Props) {
  const { styles } = useStyles();
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        pressed && styles.pressed,
        style,
      ]}
    >
      <Icon
        name={iconName}
        style={[
          styles.icon,
          disabled && styles.disabled,
          (iconSize === 'default') && styles.iconDefault,
          (iconSize === 'large') && styles.iconLarge,
          (iconSize === 'medium') && styles.iconMedium,
        ]}
      />
    </Pressable>
  );
}
