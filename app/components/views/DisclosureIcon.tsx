import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../Theme';

type Props = {
  style?: StyleProp<ViewStyle>;
};

const useStyles = () => {
  const { colors, sizes } = useTheme();

  const styles = StyleSheet.create({
    icon: {
      color: colors.separator,
      fontSize: sizes.mediumIcon,
    },
  });

  return { colors, styles };
};

export default function DisclosureIcon({ style = {} }: Props) {
  const { styles } = useStyles();
  return <Icon name="chevron-right" style={[styles.icon, style]} />;
}
