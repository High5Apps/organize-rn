import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from './Theme';

const useStyles = () => {
  const { colors, sizes } = useTheme();

  const styles = StyleSheet.create({
    pressed: {
      opacity: 0.5,
    },
    icon: {
      color: colors.primary,
      fontSize: sizes.largeIcon,
    },
  });

  return { styles };
};

type Props = {
  iconName: string;
  onPress?: () => void;
  style?: ViewStyle,
};

export default function IconButton({ iconName, onPress, style }: Props) {
  const { styles } = useStyles();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        pressed && styles.pressed,
        style,
      ]}
    >
      <Icon name={iconName} style={styles.icon} />
    </Pressable>
  );
}

IconButton.defaultProps = {
  onPress: () => {},
  style: {},
};
