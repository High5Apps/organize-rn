import React from 'react';
import {
  Pressable, StyleProp, StyleSheet, Text, ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../Theme';
import useDisabledDuringOnPress from './DisabledDuringOnPress';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
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
      opacity: 0.5,
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
  iconName: string;
  label: string;
  onPress?: (() => Promise<void>) | (() => void);
  reversed?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function SecondaryButton({
  disabled: disabledProp, iconName, label, onPress, reversed, style,
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
      <Icon name={iconName} style={styles.icon} />
      <Text style={styles.text}>
        {label}
      </Text>
    </Pressable>
  );
}

SecondaryButton.defaultProps = {
  disabled: false,
  onPress: () => {},
  reversed: false,
  style: {},
};
