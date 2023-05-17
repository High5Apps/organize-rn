import React from 'react';
import { StyleSheet, Text } from 'react-native';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors, font } = useTheme();

  const styles = StyleSheet.create({
    text: {
      color: colors.error,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
      textAlign: 'center',
    },
  });

  return { styles };
};

type Props = {
  message?: string;
};

export default function ErrorMessage({ message }: Props) {
  const { styles } = useStyles();
  return <Text style={styles.text}>{message}</Text>;
}

ErrorMessage.defaultProps = {
  message: '',
};
