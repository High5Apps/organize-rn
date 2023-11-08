import React, { PropsWithChildren } from 'react';
import {
  StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity,
} from 'react-native';
import useTheme from '../../Theme';
import useDisabledDuringOnPress from './DisabledDuringOnPress';

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
  onPress?: (() => Promise<void>) | (() => void);
  style?: StyleProp<TextStyle>;
};

export default function TextButton({
  children, onPress, style,
}: PropsWithChildren<Props>) {
  const { styles } = useStyles();

  const { disabled, onPressWrapper } = useDisabledDuringOnPress({ onPress });

  return (
    <TouchableOpacity disabled={disabled} onPress={onPressWrapper}>
      <Text style={[styles.text, style]}>{children}</Text>
    </TouchableOpacity>
  );
}

TextButton.defaultProps = {
  onPress: () => {},
  style: {},
};
