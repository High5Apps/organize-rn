import React from 'react';
import {
  Pressable, StyleProp, StyleSheet, Text, ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTheme from './Theme';

const useStyles = () => {
  const theme = useTheme();
  const styles = StyleSheet.create({
    icon: {
      color: theme.colors.background,
      fontSize: 24,
      marginEnd: theme.spacing.s,
    },
    pressable: {
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      borderRadius: 25,
      elevation: 4, // Android only
      flex: 1,
      flexDirection: 'row',
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
      opacity: 0.5,
      shadowOffset: {
        height: 1,
        width: 0,
      },
      shadowRadius: 1,
    },
    text: {
      color: theme.colors.background,
      fontSize: theme.font.sizes.paragraph,
      fontFamily: theme.font.weights.regular,
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

const PrimaryButton = (props: Props) => {
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

export default PrimaryButton;

PrimaryButton.defaultProps = {
  onPress: () => {},
  style: {},
};
