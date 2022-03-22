import React from 'react';
import {
  Pressable, StyleProp, StyleSheet, Text, ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from './Theme';

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
      flex: 1,
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
      fontSize: font.sizes.paragraph,
      fontFamily: font.weights.regular,
    },
  });
  return { styles };
};

type Props = {
  disabled?: boolean;
  iconName: string;
  label: string;
  onPress?: () => void;
  reversed?: boolean;
  style?: StyleProp<ViewStyle>;
};

const SecondaryButton = (props: Props) => {
  const {
    disabled, iconName, label, onPress, reversed, style,
  } = props;

  const { styles } = useStyles();

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pressable,
        reversed && styles.reversed,
        (disabled || pressed) && styles.pressed,
        style,
      ]}
    >
      <Icon name={iconName} style={styles.icon} />
      <Text style={styles.text}>
        {label}
      </Text>
    </Pressable>
  );
};

export default SecondaryButton;

SecondaryButton.defaultProps = {
  disabled: false,
  onPress: () => {},
  reversed: false,
  style: {},
};
