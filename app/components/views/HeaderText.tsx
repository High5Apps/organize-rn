import React, { PropsWithChildren } from 'react';
import {
  StyleProp, StyleSheet, Text, ViewStyle,
} from 'react-native';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors, font } = useTheme();

  const styles = StyleSheet.create({
    text: {
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.semiBold,
    },
  });

  return { styles };
};

type Props = {
  style?: StyleProp<ViewStyle>;
};

export default function HeaderText({ children, style }: PropsWithChildren<Props>) {
  const { styles } = useStyles();
  return <Text style={[styles.text, style]}>{children}</Text>;
}

HeaderText.defaultProps = {
  style: {},
};
