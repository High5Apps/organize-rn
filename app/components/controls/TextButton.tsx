import React, { PropsWithChildren } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors, font, sizes } = useTheme();

  const styles = StyleSheet.create({
    text: {
      alignSelf: 'flex-start',
      color: colors.primary,
      fontSize: font.sizes.subhead,
      fontFamily: font.weights.regular,
      minWidth: sizes.minimumTappableLength,
    },
  });

  return { styles };
};

type Props = {
  onPress?: () => void;
};

export default function TextButton({ children, onPress }: PropsWithChildren<Props>) {
  const { styles } = useStyles();

  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
}

TextButton.defaultProps = {
  onPress: () => {},
};
