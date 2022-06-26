import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors, sizes } = useTheme();

  const styles = StyleSheet.create({
    pressed: {
      opacity: 0.5,
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
  });

  return { styles };
};

type IconSize = 'default' | 'large';

type Props = {
  iconName: string;
  iconSize?: IconSize;
  onPress?: () => void;
  style?: ViewStyle,
};

export default function IconButton({
  iconName, iconSize, onPress, style,
}: Props) {
  const { styles } = useStyles();
  return (
    <Pressable
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
          (iconSize === 'default') && styles.iconDefault,
          (iconSize === 'large') && styles.iconLarge,
        ]}
      />
    </Pressable>
  );
}

IconButton.defaultProps = {
  iconSize: 'default',
  onPress: () => {},
  style: {},
};
