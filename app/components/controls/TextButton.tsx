import React, { PropsWithChildren } from 'react';
import {
  StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle,
} from 'react-native';
import useTheme from '../../Theme';
import useDisabledDuringOnPress from './DisabledDuringOnPress';

const useStyles = () => {
  const { colors, font, sizes } = useTheme();

  const styles = StyleSheet.create({
    disabled: {
      color: colors.labelSecondary,
    },
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
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  onPress?: (() => Promise<void>) | (() => void);
  style?: StyleProp<TextStyle>;
};

export default function TextButton({
  children, containerStyle, disabled, onPress, style,
}: PropsWithChildren<Props>) {
  const { styles } = useStyles();

  const {
    disabled: disabledDuringPress, onPressWrapper,
  } = useDisabledDuringOnPress({ onPress });

  return (
    <TouchableOpacity
      style={containerStyle}
      disabled={disabled || disabledDuringPress}
      onPress={onPressWrapper}
    >
      <Text style={[styles.text, disabled && styles.disabled, style]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

TextButton.defaultProps = {
  containerStyle: {},
  disabled: false,
  onPress: () => {},
  style: {},
};
