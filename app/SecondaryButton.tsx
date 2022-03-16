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
      marginEnd: spacing.s,
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
    text: {
      color: colors.primary,
      fontSize: font.sizes.paragraph,
      fontFamily: font.weights.regular,
    },
  });
  return { styles };
};

type Props = {
  iconName: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  label: string;
};

const SecondaryButton = (props: Props) => {
  const {
    iconName, onPress, label, style,
  } = props;

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
      <Icon name={iconName} style={styles.icon} />
      <Text style={styles.text}>
        {label}
      </Text>
    </Pressable>
  );
};

export default SecondaryButton;

SecondaryButton.defaultProps = {
  onPress: () => {},
  style: {},
};
