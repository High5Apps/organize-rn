import React from 'react';
import {
  Pressable, StyleProp, StyleSheet, Text, ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../Theme';
import useDisabledDuringOnPress from './DisabledDuringOnPress';

const useStyles = () => {
  const {
    colors, font, isDarkMode, shadows, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    icon: {
      color: colors.background,
      fontSize: sizes.icon,
      marginEnd: spacing.s,
    },
    pressable: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: 25,
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      ...shadows.elevation4,
    },
    pressed: {
      opacity: isDarkMode ? 0.5 : 1,
      ...shadows.elevation1,
    },
    text: {
      color: colors.background,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
    },
  });
  return { styles };
};

type Props = {
  iconName: string;
  onPress?: (() => Promise<void>) | (() => void);
  style?: StyleProp<ViewStyle>;
  label: string;
};

export default function PrimaryButton({
  iconName, onPress, label, style,
}: Props) {
  const { styles } = useStyles();
  const { disabled, onPressWrapper } = useDisabledDuringOnPress({ onPress });

  return (
    <Pressable
      disabled={disabled}
      onPress={onPressWrapper}
      style={({ pressed }) => [
        styles.pressable,
        pressed && styles.pressed,
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

PrimaryButton.defaultProps = {
  onPress: () => {},
  style: {},
};
