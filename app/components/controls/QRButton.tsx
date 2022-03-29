import React from 'react';
import {
  Pressable, StyleSheet, Text, useColorScheme, ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from '../../Theme';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const isDarkMode = useColorScheme() === 'dark';

  const styles = StyleSheet.create({
    icon: {
      color: colors.primary,
      fontSize: sizes.extraLargeIcon,
      marginBottom: spacing.s,
    },
    pressable: {
      alignItems: 'center',
      aspectRatio: 1,
      backgroundColor: colors.fill,
      borderColor: colors.primary,
      borderWidth: spacing.s,
      elevation: 4, // Android only
      justifyContent: 'center',
      shadowOffset: { // iOS only
        height: 2,
        width: 0,
      },
      shadowOpacity: 0.5, // iOS only
      shadowRadius: 4, // iOS only
    },
    pressed: {
      elevation: 1,
      opacity: isDarkMode ? 0.5 : 1,
      shadowOffset: {
        height: 1,
        width: 0,
      },
      shadowRadius: 1,
    },
    prompt: {
      color: colors.labelSecondary,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.body,
      textAlign: 'center',
    },
  });
  return { styles };
};

type Props = {
  onPress?: () => void;
  style?: ViewStyle;
};

export default function QRButton(props: Props) {
  const { onPress, style } = props;

  const { styles } = useStyles();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pressable,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Icon name="qr-code-scanner" style={styles.icon} />
      <Text style={styles.prompt}>
        {'Tap to allow\ncamera access'}
      </Text>
    </Pressable>
  );
}

QRButton.defaultProps = {
  onPress: () => {},
  style: {},
};
