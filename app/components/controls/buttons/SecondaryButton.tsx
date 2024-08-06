import React from 'react';
import {
  Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../../Theme';
import useDisabledDuringOnPress from '../DisabledDuringOnPress';

const useStyles = () => {
  const {
    colors, font, opacity, sizes, spacing,
  } = useTheme();
  const styles = StyleSheet.create({
    icon: {
      color: colors.primary,
      fontSize: 24,
      marginHorizontal: spacing.xs,
    },
    pressable: {
      flexDirection: 'row',
      height: sizes.buttonHeight,
      justifyContent: 'center',
      alignItems: 'center',
    },
    pressed: {
      opacity: opacity.disabled,
    },
    reversed: {
      flexDirection: 'row-reverse',
    },
    text: {
      color: colors.primary,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
    },
  });
  return { styles };
};

type Props = {
  disabled?: boolean;
  iconName?: string;
  iconStyle?: StyleProp<TextStyle>;
  label: string;
  onPress?: (() => Promise<void>) | (() => void);
  reversed?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function SecondaryButton({
  disabled: disabledProp, iconName, iconStyle, label, onPress, reversed, style,
  textStyle,
}: Props) {
  const { styles } = useStyles();
  const {
    disabled: disabledDueToOnPress, onPressWrapper,
  } = useDisabledDuringOnPress({ onPress });
  return (
    <Pressable
      disabled={disabledProp || disabledDueToOnPress}
      onPress={onPressWrapper}
      style={({ pressed }) => [
        styles.pressable,
        reversed && styles.reversed,
        (disabledProp || pressed) && styles.pressed,
        style,
      ]}
    >
      {iconName && <Icon name={iconName} style={[styles.icon, iconStyle]} />}
      <Text style={[styles.text, textStyle]}>
        {label}
      </Text>
    </Pressable>
  );
}

SecondaryButton.defaultProps = {
  disabled: false,
  iconName: undefined,
  iconStyle: {},
  onPress: () => {},
  reversed: false,
  style: {},
  textStyle: {},
};
