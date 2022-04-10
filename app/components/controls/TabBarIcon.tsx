import React from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors, sizes } = useTheme();

  const styles = StyleSheet.create({
    icon: {
      fontSize: sizes.tabIcon,
    },
    iconBlurred: {
      color: colors.labelSecondary,
    },
    iconFocused: {
      color: colors.primary,
    },
  });

  return { colors, styles };
};

type Props = {
  focused: boolean;
  color: string;
  size: number;
};

const TabBarIcon = (iconName: string) => ({ focused, color, size }: Props) => {
  const { styles } = useStyles();

  return (
    <Icon
      size={size}
      name={iconName}
      style={[
        styles.icon,
        focused ? styles.iconFocused : styles.iconBlurred,
      ]}
    />
  );
};

export default TabBarIcon;
